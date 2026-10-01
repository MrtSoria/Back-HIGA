import { Protocolo } from '../protocolos.entity.js';

export class ProtocoloResponseDto {

    id: string;
    subtitulo: string;
    desc: string;
    id_diagnostico?: string;

    constructor(protocolo: Protocolo) {
        this.id = protocolo.id;
        this.subtitulo = protocolo.subtitulo;
        this.desc = protocolo.desc;
        this.id_diagnostico = protocolo.diagnostico?.id;
    }
}