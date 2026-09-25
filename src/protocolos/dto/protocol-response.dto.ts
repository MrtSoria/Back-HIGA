import { Protocolo } from '../protocolos.entity.js';

export class ProtocoloResponseDto {

    id: number;
    titulo: string;
    subtitulo: string;
    desc: string;
    id_diagnostico: number;
    creado: Date;
    modificado: Date;

    constructor(protocolo: Protocolo) {
        this.id = protocolo.id;
        this.titulo = protocolo.titulo;
        this.subtitulo = protocolo.subtitulo;
        this.desc = protocolo.desc;
        this.id_diagnostico = protocolo.id_diagnostico?.id;
        this.creado = protocolo.creado;
        this.modificado = protocolo.modificado;
    }
}