import { Injectable } from '@nestjs/common';
import { SyncRequestDto } from './dto/sync-request.dto.js';
import { SyncRepository } from './sync.repository.js';
import { Cambio } from '../historial/historial.entity.js';
import { Entidad, Operacion } from '../historial/historial.enums.js';
import { SyncResponseDto } from './dto/sync-response.dto.js';
import { DiagnosticoResponseDto } from '../diagnosticos/dto/diagnostic-response.dto.js';
import { ProtocoloResponseDto } from '../protocolos/dto/protocol-response.dto.js';
import { UsuariosRepository } from '../usuarios/usuarios.repository.js';
import { Diagnostico } from '../diagnosticos/diagnosticos.entity.js';
import { Protocolo } from '../protocolos/protocolos.entity.js';

@Injectable()
export class SyncService {
    constructor(
        private readonly repository: SyncRepository,
        private readonly usersRepository: UsuariosRepository
    ) { }

    async sincronizar(dto: SyncRequestDto): Promise<SyncResponseDto> {
        const cambios = await this.repository.getSyncData(dto.sync);

        // Se guarda la ultima operacion sobre una entidad para evitar acciones 
        // redundantes o innecesarias. 
        const cambiosConsolidados = new Map<string, Cambio>();
        for (const cambio of cambios) {
            if (
                cambio.entidad === Entidad.USUARIO && (
                    cambio.operacion !== Operacion.UPDATE ||
                    cambio.id_entidad !== dto.id
                )
            ) continue;

            const key = `${cambio.entidad}-${cambio.id_entidad}`;
            const cambioAnterior = cambiosConsolidados.get(key);

            if (
                cambioAnterior?.operacion === Operacion.CREATE &&
                cambio.operacion === Operacion.UPDATE
            ) continue;

            if (
                cambioAnterior?.operacion === Operacion.CREATE &&
                cambio.operacion === Operacion.DELETE
            ) {
                cambiosConsolidados.delete(key);
                continue;
            }

            cambiosConsolidados.set(key, cambio);
        }

        const cambioUsuario = cambiosConsolidados.get(
            `${Entidad.USUARIO}-${dto.id}`
        );

        const reset = Boolean(
            cambioUsuario &&
            cambioUsuario.operacion === Operacion.UPDATE &&
            cambioUsuario.especialidades?.length
        );

        const especialidadesUser =
            await this.usersRepository.buscarEspecialidadesPorUsuario(dto.id);

        const ids_especialidadesUser = new Set(
            especialidadesUser.map(e => e.id)
        );

        type Entity =
            | Entidad.DIAGNOSTICO
            | Entidad.PROTOCOLO;

        const idsPorOperacion: Record<Operacion,
            Record<Entity, string[]>> = {
            [Operacion.CREATE]: {
                [Entidad.DIAGNOSTICO]: [],
                [Entidad.PROTOCOLO]: [],
            },
            [Operacion.UPDATE]: {
                [Entidad.DIAGNOSTICO]: [],
                [Entidad.PROTOCOLO]: [],
            },
            [Operacion.DELETE]: {
                [Entidad.DIAGNOSTICO]: [],
                [Entidad.PROTOCOLO]: []
            }
        }

        let nroSync = dto.sync;
        for (const cambio of cambiosConsolidados.values()) {
            if (
                cambio.entidad === Entidad.DIAGNOSTICO ||
                cambio.entidad === Entidad.PROTOCOLO
            ) {
                idsPorOperacion[cambio.operacion][cambio.entidad]
                    .push(cambio.id_entidad);
            }
        }

        if (cambios.length > 0) {
            nroSync = cambios[cambios.length - 1].id;
        }

        const [diagnosticos, protocolos] = await Promise.all(
            reset ? [
                this.repository.getAllDiagnosticos(),
                this.repository.getAllProtocolos(),
            ]
                : [
                    this.repository.getDiagnosticos([
                        ...idsPorOperacion[Operacion.CREATE][Entidad.DIAGNOSTICO],
                        ...idsPorOperacion[Operacion.UPDATE][Entidad.DIAGNOSTICO],
                    ]),
                    this.repository.getProtocolos([
                        ...idsPorOperacion[Operacion.CREATE][Entidad.PROTOCOLO],
                        ...idsPorOperacion[Operacion.UPDATE][Entidad.PROTOCOLO],
                    ]),
                ],
        );

        const dCorresponde = (diagnostico: Diagnostico): boolean => {
            const ids_especialidadesDiag =
                diagnostico.especialidades?.map(e => e.id) ?? [];

            return (
                ids_especialidadesUser.size === 0 ||
                ids_especialidadesDiag.length === 0 ||
                ids_especialidadesDiag.some(
                    id => ids_especialidadesUser.has(id)
                )
            );
        };

        const pCorresponde = (protocolo: Protocolo): boolean => {
            const diagnostico = protocolo.diagnostico;

            if (!diagnostico) return false;

            return dCorresponde(diagnostico);
        }

        const diagnosticosFiltrados = diagnosticos.filter(dCorresponde);
        const protocolosFiltrados = protocolos.filter(pCorresponde);

        const diagnosticosABorrar = [
            ...new Set([
                ...idsPorOperacion[Operacion.DELETE][Entidad.DIAGNOSTICO],
                ...diagnosticos
                    .filter(d => !dCorresponde(d))
                    .map(d => d.id),
            ]),
        ];

        const protocolosABorrar = [
            ...new Set([
                ...idsPorOperacion[Operacion.DELETE][Entidad.PROTOCOLO],
                ...protocolos
                    .filter(p => !pCorresponde(p))
                    .map(p => p.id)
            ]),
        ];

        return {
            nro_sync: nroSync,
            reset: reset,
            diagnosticos: diagnosticosFiltrados.map(
                d => new DiagnosticoResponseDto(d)
            ),
            protocolos: protocolosFiltrados.map(
                p => new ProtocoloResponseDto(p)
            ),
            deleted: {
                diagnosticos: diagnosticosABorrar,
                protocolos: protocolosABorrar,
            },
        };
    }
}
