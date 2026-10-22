import { Cambio } from '../historial.entity.js';
import { Entidad, Operacion } from '../historial.enums.js';

export class CambioResponseDto {

    id: string;
    entidad: Entidad;
    id_entidad: string;
    operacion: Operacion;
    creado: Date;
    especialidades: string[]

    constructor(cambio: Cambio) {
        this.id = cambio.id;
        this.entidad = cambio.entidad;
        this.id_entidad = cambio.id_entidad;
        this.operacion = cambio.operacion;
        this.creado = cambio.creado;
        this.especialidades = (cambio.especialidades ?? []).map(
            e => e.nombre
        );
    }
}