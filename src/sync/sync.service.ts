import { Injectable } from '@nestjs/common';
import { SyncRequestDto } from './dto/sync-request.dto.js';
import { SyncRepository } from './sync.repository.js';
import { Cambio } from '../historial/historial.entity.js';
import { Entidad, Operacion } from '../historial/historial.enums.js';

@Injectable()
export class SyncService {
    constructor(
        private readonly repository: SyncRepository,
    ) { }

    async sincronizar(dto: SyncRequestDto) {
        const cambios = await this.repository.getSyncData(dto.last_sync)
        const cambiosClasificados = new Map<string, Cambio>();

        for (const cambio of cambios) {
            const key = `${cambio.entidad}-${cambio.id_entidad}`;
            cambiosClasificados.set(key, cambio);
        }

        type Entity =
            | Entidad.DIAGNOSTICO
            | Entidad.PROTOCOLO;
        //Aca hay que agregar las entidades que se quieran sincronizar

        const resultado: Record<Operacion,
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

        for (const cambio of cambiosClasificados.values()) {
            if (
                cambio.entidad === Entidad.DIAGNOSTICO ||
                cambio.entidad === Entidad.PROTOCOLO
            ) {
                resultado[cambio.operacion][cambio.entidad]
                    .push(cambio.id_entidad);
            }
        }
        return {
            last_sync: await this.repository.getLastSync(),
            cambios: resultado
        };
    }
}
