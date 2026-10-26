import { DiagnosticoResponseDto } from "../../diagnosticos/dto/diagnostic-response.dto.js";
import { ProtocoloResponseDto } from "../../protocolos/dto/protocol-response.dto.js";

export class SyncDeletedDto {
    diagnosticos: string[];
    protocolos: string[];
}

export class SyncResponseDto {
    nro_sync: string;
    reset: boolean;
    diagnosticos: DiagnosticoResponseDto[];
    protocolos: ProtocoloResponseDto[];
    deleted: SyncDeletedDto;
}
