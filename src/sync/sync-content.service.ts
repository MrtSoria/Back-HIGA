import { Injectable } from '@nestjs/common';
import { Diagnostico } from '../diagnosticos/diagnosticos.entity.js';
import { Protocolo } from '../protocolos/protocolos.entity.js';
import { SyncRepository } from './sync.repository.js';
import { SyncChangePlan } from './sync-change-planner.service.js';

export interface SyncContentBatch {
    diagnosticos: Diagnostico[];
    protocolos: Protocolo[];
    deleted: {
        diagnosticos: string[];
        protocolos: string[];
    };
}

@Injectable()
export class SyncContentService {
    constructor(private readonly repository: SyncRepository) { }

    async construir(plan: SyncChangePlan): Promise<SyncContentBatch> {
        const [diagnosticos, protocolos] = await Promise.all(
            plan.reset
                ? [
                    this.repository.getAllDiagnosticos(),
                    this.repository.getAllProtocolos(),
                ]
                : [
                    this.repository.getDiagnosticos(
                        plan.diagnosticos.upsert,
                    ),
                    this.repository.getProtocolos(
                        plan.protocolos.upsert,
                    ),
                ],
        );

        const correspondeDiagnostico = (diagnostico: Diagnostico): boolean =>
            this.correspondePorEspecialidad(
                diagnostico.especialidades
                    ?.filter(especialidad => especialidad.deleted_at === null)
                    .map(especialidad => especialidad.id) ?? [],
                plan,
            );
        const correspondeProtocolo = (protocolo: Protocolo): boolean => {
            const diagnostico = protocolo.diagnostico;

            return diagnostico !== null && diagnostico !== undefined &&
                this.correspondePorEspecialidad(
                    diagnostico.especialidades
                        ?.filter(especialidad => especialidad.deleted_at === null)
                        .map(especialidad => especialidad.id) ?? [],
                    plan,
                );
        };

        const diagnosticosParaEnviar = diagnosticos.filter(
            correspondeDiagnostico,
        );
        const protocolosParaEnviar = protocolos.filter(
            correspondeProtocolo,
        );

        if (!plan.reset && plan.idsEspecialidadesEliminadas.length > 0) {
            const globalizados =
                await this.repository.getDiagnosticosPorEspecialidades(
                    plan.idsEspecialidadesEliminadas,
                );
            const diagnosticosGlobalizados = globalizados.filter(
                diagnostico =>
                    (diagnostico.especialidades ?? []).every(
                        especialidad => especialidad.deleted_at !== null,
                    ) &&
                    !(diagnostico.especialidades ?? []).some(especialidad =>
                        plan.especialidadesABorrar.includes(especialidad.id),
                    ),
            );

            diagnosticosParaEnviar.push(...diagnosticosGlobalizados);
            const idsProtocolosGlobalizados = diagnosticosGlobalizados
                .map(diagnostico => diagnostico.protocolo?.id)
                .filter((id): id is string => id !== undefined);
            const protocolosGlobalizados =
                await this.repository.getProtocolos(idsProtocolosGlobalizados);
            protocolosParaEnviar.push(...protocolosGlobalizados);
        }

        return {
            diagnosticos: this.unicosPorId(diagnosticosParaEnviar),
            protocolos: this.unicosPorId(protocolosParaEnviar),
            deleted: {
                diagnosticos: [
                    ...new Set([
                        ...plan.diagnosticos.deleted,
                        ...diagnosticos
                            .filter(d => !correspondeDiagnostico(d))
                            .map(d => d.id),
                    ]),
                ],
                protocolos: [
                    ...new Set([
                        ...plan.protocolos.deleted,
                        ...protocolos
                            .filter(p => !correspondeProtocolo(p))
                            .map(p => p.id),
                    ]),
                ],
            },
        };
    }

    private correspondePorEspecialidad(
        idsEspecialidades: string[],
        plan: SyncChangePlan,
    ): boolean {
        return (
            plan.idsEspecialidadesUsuario.size === 0 ||
            idsEspecialidades.length === 0 ||
            idsEspecialidades.some(id =>
                plan.idsEspecialidadesUsuario.has(id),
            )
        );
    }

    private unicosPorId<T extends { id: string }>(entities: T[]): T[] {
        return [...new Map(entities.map(entity => [entity.id, entity])).values()];
    }
}
