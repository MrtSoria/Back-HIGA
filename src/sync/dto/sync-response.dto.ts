import { DiagnosticoResponseDto } from "../../diagnosticos/dto/diagnostic-response.dto.js";
import { ProtocoloResponseDto } from "../../protocolos/dto/protocol-response.dto.js";
import { Usuario } from "../../usuarios/usuarios.entity.js";

export class SyncDeletedDto {
    diagnosticos: string[];
    protocolos: string[];
}

export class SyncUsuarioDto {
    id: string;
    nombre: string;
    apellido: string;
    username: string;
    is_admin: boolean;

    constructor(user: Usuario) {
        this.id = user.id;
        this.nombre = user.nombre;
        this.apellido = user.apellido;
        this.username = user.username;
        this.is_admin = user.is_admin;
    }
}

export class SyncResponseDto {
    nro_sync: string;
    last_sync_at: string;
    reset: boolean;
    diagnosticos: DiagnosticoResponseDto[];
    protocolos: ProtocoloResponseDto[];
    especialidades: {
        id: string;
        nombre: string;
    }[] | null;
    deleted: SyncDeletedDto;
    usuario_actualizado: SyncUsuarioDto | null;
    usuario_eliminado: boolean;
}
