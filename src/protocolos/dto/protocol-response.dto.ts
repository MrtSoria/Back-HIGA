import { Protocolo } from '../protocolos.entity.js';

export class ProtocoloResponseDto {

    id: number;
    titulo: string;
    subtitulo: string;
    desc: string;
    diagnosticoId: number;
    creado: Date;
    modificado: Date;

    constructor(protocolo: Protocolo) {
        this.id = protocolo.id;
        this.titulo = protocolo.titulo;
        this.subtitulo = protocolo.subtitulo;
        this.desc = protocolo.desc;
        this.diagnosticoId = protocolo.diagnosticoId?.id;
        this.creado = protocolo.creado;
        this.modificado = protocolo.modificado;
    }
}