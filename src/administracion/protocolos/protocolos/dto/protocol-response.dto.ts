import { Protocolo } from '../protocolos.entity.js';

export class ProtocoloResponseDto {

    id: number;
    titulo: string;
    subtitulo: string;
    desc: string;
    creado: Date;
    modificado: Date;

    constructor(protocolo: Protocolo) {
        this.id = protocolo.id;
        this.titulo = protocolo.titulo;
        this.subtitulo = protocolo.subtitulo;
        this.desc = protocolo.desc;
        this.creado = protocolo.creado;
        this.modificado = protocolo.modificado;
    }
}