import { Diagnostico } from '../../diagnosticos/diagnosticos.entity.js';
import { ProtocoloResponseDto } from '../../protocolos/dto/protocol-response.dto.js';

export class DiagnosticoResponseDto {

    id: string;
    titulo: string;
    desc: string;
    protocolo?: ProtocoloResponseDto;
    etiquetas: string[];

    constructor(diagnostico: Diagnostico) {
        this.id = diagnostico.id;
        this.titulo = diagnostico.titulo;
        this.desc = diagnostico.desc;
        this.protocolo = diagnostico.protocolo ?
            new ProtocoloResponseDto(diagnostico.protocolo) : undefined;
        this.etiquetas = diagnostico.etiquetas;
    }
}