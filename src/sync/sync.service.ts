import { Injectable } from '@nestjs/common';
import { SyncRequestDto } from './dto/sync-request.dto.js';
import { SyncRepository } from './sync.repository.js';
import { Cambio } from '../historial/historial.entity.js';
import { Entidad, Operacion } from '../historial/historial.enums.js';
import { SyncResponseDto } from './dto/sync-response.dto.js';
import { DiagnosticoResponseDto } from '../diagnosticos/dto/diagnostic-response.dto.js';
import { ProtocoloResponseDto } from '../protocolos/dto/protocol-response.dto.js';

@Injectable()
export class SyncService {
    constructor(
        private readonly repository: SyncRepository,
    ) { }

    async sincronizar(dto: SyncRequestDto): Promise<SyncResponseDto> {
        const cambios = await this.repository.getSyncData(dto.sync);

        // Se guarda la ultima operacion sobre una entidad para evitar acciones 
        // redundantes o innecesarias. 
        const cambiosConsolidados = new Map<string, Cambio>();
        for (const cambio of cambios) {
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

        const [diagnosticosCreados, diagnosticosActualizados,
            protocolosCreados, protocolosActualizados] = await Promise.all([
                this.repository.getDiagnosticos(
                    idsPorOperacion[Operacion.CREATE][Entidad.DIAGNOSTICO],
                ),
                this.repository.getDiagnosticos(
                    idsPorOperacion[Operacion.UPDATE][Entidad.DIAGNOSTICO],
                ),
                this.repository.getProtocolos(
                    idsPorOperacion[Operacion.CREATE][Entidad.PROTOCOLO],
                ),
                this.repository.getProtocolos(
                    idsPorOperacion[Operacion.UPDATE][Entidad.PROTOCOLO],
                ),
            ]);

        return {
            nro_sync: nroSync,
            created: {
                diagnosticos: diagnosticosCreados.map(
                    (diagnostico) => new DiagnosticoResponseDto(diagnostico),
                ),
                protocolos: protocolosCreados.map(
                    (protocolo) => new ProtocoloResponseDto(protocolo),
                ),
            },
            updated: {
                diagnosticos: diagnosticosActualizados.map(
                    (diagnostico) => new DiagnosticoResponseDto(diagnostico),
                ),
                protocolos: protocolosActualizados.map(
                    (protocolo) => new ProtocoloResponseDto(protocolo),
                ),
            },
            deleted: {
                diagnosticos: idsPorOperacion[Operacion.DELETE][Entidad.DIAGNOSTICO],
                protocolos: idsPorOperacion[Operacion.DELETE][Entidad.PROTOCOLO],
            },
        };
    }
}
