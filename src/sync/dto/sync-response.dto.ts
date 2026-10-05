import { DiagnosticoResponseDto } from "../../diagnosticos/dto/diagnostic-response.dto.js";
import { ProtocoloResponseDto } from "../../protocolos/dto/protocol-response.dto.js";

export class SyncCreatedDto {
    diagnosticos: DiagnosticoResponseDto[];
    protocolos: ProtocoloResponseDto[];
}

export class SyncUpdatedDto {
    diagnosticos: DiagnosticoResponseDto[];
    protocolos: ProtocoloResponseDto[];
}

export class SyncDeletedDto {
    diagnosticos: string[];
    protocolos: string[];
}

export class SyncResponseDto {
    nro_sync: string;
    created: SyncCreatedDto;
    updated: SyncUpdatedDto;
    deleted: SyncDeletedDto;
}
