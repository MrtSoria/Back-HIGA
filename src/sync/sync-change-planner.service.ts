import { BadRequestException, Injectable } from '@nestjs/common';
import { Cambio } from '../historial/historial.entity.js';
import { Entidad, Operacion } from '../historial/historial.enums.js';
import { UsuariosRepository } from '../usuarios/usuarios.repository.js';
import { SyncRequestDto } from './dto/sync-request.dto.js';
import { SyncRepository } from './sync.repository.js';
import { Usuario } from '../usuarios/usuarios.entity.js';

interface EntityChanges {
    upsert: string[];
    deleted: string[];
}

export interface SyncChangePlan {
    nroSync: string;
    reset: boolean;
    idsEspecialidadesUsuario: Set<string>;
    idsEspecialidadesEliminadas: string[];
    especialidadesABorrar: string[];
    especialidadesUsuario: { id: string; nombre: string }[] | null;
    diagnosticos: EntityChanges;
    protocolos: EntityChanges;
    usuario_actualizado: Usuario | null;
    usuario_eliminado: boolean;
}

@Injectable()
export class SyncChangePlanner {
    constructor(
        private readonly syncRepository: SyncRepository,
        private readonly usersRepository: UsuariosRepository,
    ) { }

    async planificar(dto: SyncRequestDto, now: Date): Promise<SyncChangePlan> {
        const cambios = await this.syncRepository.getSyncData(dto.sync);
        const cambiosConsolidados = this.consolidarCambios(cambios, dto.id);
        const especialidadesUsuario =
            await this.usersRepository.buscarEspecialidadesActivasPorUsuario(dto.id);
        const idsEspecialidadesUsuario = new Set(
            especialidadesUsuario.map(especialidad => especialidad.id),
        );

        const cambiosEspecialidadEliminada = [
            ...cambiosConsolidados.values(),
        ].filter(
            cambio =>
                cambio.entidad === Entidad.ESPECIALIDAD &&
                cambio.operacion === Operacion.DELETE,
        );
        const idsEspecialidadesEliminadas =
            cambiosEspecialidadEliminada.map(cambio => cambio.id_entidad);

        const especialidadesABorrar = (
            await Promise.all(
                idsEspecialidadesEliminadas.map(async id => {
                    const pertenecia =
                        await this.usersRepository.perteneciaAEspecialidadEliminada(
                            dto.id,
                            id,
                        );
                    return pertenecia ? id : null;
                }),
            )
        ).filter((id): id is string => id !== null);

        const especialidadesActualizadas = [
            ...new Set(
                [...cambiosConsolidados.values()]
                    .filter(
                        cambio =>
                            cambio.entidad === Entidad.ESPECIALIDAD &&
                            cambio.operacion === Operacion.UPDATE &&
                            idsEspecialidadesUsuario.has(cambio.id_entidad),
                    )
                    .map(cambio => cambio.id_entidad),
            ),
        ];

        const diagnosticos: EntityChanges = { upsert: [], deleted: [] };
        const protocolos: EntityChanges = { upsert: [], deleted: [] };

        for (const cambio of cambiosConsolidados.values()) {
            if (
                cambio.entidad !== Entidad.DIAGNOSTICO &&
                cambio.entidad !== Entidad.PROTOCOLO
            ) {
                continue;
            }

            const destino: EntityChanges =
                cambio.entidad === Entidad.DIAGNOSTICO
                    ? diagnosticos
                    : protocolos;

            if (cambio.operacion !== Operacion.DELETE) {
                destino.upsert.push(cambio.id_entidad);
                continue;
            }

            const idsEspecialidades = cambio.especialidades?.map(
                especialidad => especialidad.id,
            ) ?? [];
            const corresponde =
                idsEspecialidadesUsuario.size === 0 ||
                idsEspecialidades.length === 0 ||
                idsEspecialidades.some(id =>
                    idsEspecialidadesUsuario.has(id),
                );

            if (corresponde) {
                destino.deleted.push(cambio.id_entidad);
            }
        }

        const lastSyncAt = dto.last_sync_at
            ? Date.parse(dto.last_sync_at)
            : Number.NaN;

        if (Number.isNaN(lastSyncAt)) {
            if (dto.last_sync_at) {
                throw new BadRequestException(
                    'La fecha de sincronizacion no es valida',
                );
            }
        } else if (lastSyncAt > now.getTime()) {
            throw new BadRequestException(
                'La fecha de sincronizacion no puede ser futura',
            );
        }

        const resetPorAntiguedad =
            Number.isNaN(lastSyncAt) ||
            now.getTime() - lastSyncAt > 30 * 24 * 60 * 60 * 1000;

        const cambioUsuario = cambiosConsolidados.get(
            `${Entidad.USUARIO}-${dto.id}`,
        );

        const usuarioEliminado =
            cambioUsuario?.operacion === Operacion.DELETE;

        const usuarioActualizado =
            cambioUsuario?.operacion === Operacion.UPDATE
                ? await this.usersRepository.buscarPorId(dto.id)
                : null;

        const resetPorCambioDeEspecialidades =
            cambioUsuario?.operacion === Operacion.UPDATE &&
            Boolean(cambioUsuario.especialidades?.length);

        const resetPorEliminacionDeEspecialidad =
            especialidadesABorrar.length > 0;

        const reset =
            resetPorAntiguedad ||
            resetPorCambioDeEspecialidades ||
            resetPorEliminacionDeEspecialidad;

        const enviarEspecialidadesUsuario =
            reset || especialidadesActualizadas.length > 0;

        return {
            nroSync: cambios.at(-1)?.id ?? dto.sync,
            reset,
            idsEspecialidadesUsuario,
            idsEspecialidadesEliminadas,
            especialidadesABorrar,
            especialidadesUsuario: enviarEspecialidadesUsuario
                ? especialidadesUsuario.map(({ id, nombre }) => ({ id, nombre }))
                : null,
            diagnosticos: this.unicos(diagnosticos),
            protocolos: this.unicos(protocolos),
            usuario_actualizado: usuarioActualizado,
            usuario_eliminado: usuarioEliminado,
        };
    }

    private consolidarCambios(
        cambios: Cambio[],
        usuarioId: string,
    ): Map<string, Cambio> {
        const consolidados = new Map<string, Cambio>();

        for (const cambio of cambios) {
            if (
                cambio.entidad === Entidad.USUARIO &&
                cambio.id_entidad !== usuarioId
            ) continue;

            const key = `${cambio.entidad}-${cambio.id_entidad}`;
            const anterior = consolidados.get(key);

            if (
                anterior?.operacion === Operacion.CREATE &&
                cambio.operacion === Operacion.UPDATE
            ) {
                continue;
            }

            if (
                cambio.entidad === Entidad.USUARIO &&
                cambio.id_entidad === usuarioId &&
                cambio.operacion === Operacion.DELETE
            ) {
                consolidados.set(key, cambio);
                continue;
            }

            if (
                anterior?.operacion === Operacion.CREATE &&
                cambio.operacion === Operacion.DELETE
            ) {
                consolidados.delete(key);
                continue;
            }

            consolidados.set(key, cambio);
        }

        return consolidados;
    }

    private unicos(cambios: EntityChanges): EntityChanges {
        return {
            upsert: [...new Set(cambios.upsert)],
            deleted: [...new Set(cambios.deleted)],
        };
    }
}
