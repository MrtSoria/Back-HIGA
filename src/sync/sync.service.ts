import { Injectable } from '@nestjs/common';
import { SyncRequestDto } from './dto/sync-request.dto.js';
import { SyncResponseDto, SyncUsuarioDto } from './dto/sync-response.dto.js';
import { DiagnosticoResponseDto } from '../diagnosticos/dto/diagnostic-response.dto.js';
import { ProtocoloResponseDto } from '../protocolos/dto/protocol-response.dto.js';
import { SyncChangePlanner } from './sync-change-planner.service.js';
import { SyncContentBatch, SyncContentService } from './sync-content.service.js';

@Injectable()
export class SyncService {
    constructor(
        private readonly changePlanner: SyncChangePlanner,
        private readonly contentService: SyncContentService,
    ) { }

    async sincronizar(dto: SyncRequestDto): Promise<SyncResponseDto> {
        const now = new Date();
        const plan = await this.changePlanner.planificar(dto, now);
        const contenido: SyncContentBatch = plan.usuario_eliminado
            ? {
                diagnosticos: [],
                protocolos: [],
                deleted: { diagnosticos: [], protocolos: [] },
            }
            : await this.contentService.construir(plan);

        return {
            nro_sync: plan.nroSync,
            last_sync_at: now.toISOString(),
            reset: plan.reset,
            diagnosticos: contenido.diagnosticos.map(
                diagnostico => new DiagnosticoResponseDto(diagnostico),
            ),
            protocolos: contenido.protocolos.map(
                protocolo => new ProtocoloResponseDto(protocolo),
            ),
            especialidades: plan.especialidadesUsuario,
            deleted: plan.reset ?
                {
                    diagnosticos: [],
                    protocolos: [],
                } : {
                    ...contenido.deleted,
                },
            usuario_actualizado: plan.usuario_actualizado
                ? new SyncUsuarioDto(plan.usuario_actualizado)
                : null,
            usuario_eliminado: plan.usuario_eliminado,
        };
    }
}
