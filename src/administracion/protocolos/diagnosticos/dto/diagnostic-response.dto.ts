import { Diagnostico } from '../../diagnosticos/diagnosticos.entity.js';
import { Protocolo } from '../../protocolos/protocolos.entity.js';

export class DiagnosticoResponseDto {

    id: number;
    titulo: string;
    desc: string;
    protocolo?: Protocolo;

    constructor(diagnostico: Diagnostico) {
        this.id = diagnostico.id;
        this.titulo = diagnostico.titulo;
        this.desc = diagnostico.desc;
        this.protocolo = diagnostico.protocolo;
    }
}