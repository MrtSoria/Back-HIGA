import { Diagnostico } from '../../diagnosticos/diagnosticos.entity.js';
import { EspecialidadResponseDto } from '../../especialidades/dto/especialidad-response.dto.js';
import { ProtocoloResponseDto } from '../../protocolos/dto/protocol-response.dto.js';

export class DiagnosticoResponseDto {

    id: string;
    titulo: string;
    desc: string;
    protocolo?: ProtocoloResponseDto;
    especialidades: EspecialidadResponseDto[];
    etiquetas: string[];

    constructor(diagnostico: Diagnostico) {
        this.id = diagnostico.id;
        this.titulo = diagnostico.titulo;
        this.desc = diagnostico.desc;
        this.protocolo = diagnostico.protocolo ?
            new ProtocoloResponseDto(diagnostico.protocolo) : undefined;
        this.especialidades = diagnostico.especialidades.map(
            (especialidad) => new EspecialidadResponseDto(especialidad)
        );
        this.etiquetas = diagnostico.etiquetas ?? [];
    }
}