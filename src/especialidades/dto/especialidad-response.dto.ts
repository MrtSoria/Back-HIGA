import { Especialidad } from "../especialidades.entity.js";

export class EspecialidadResponseDto {

    id: string;
    nombre: string;

    constructor(especialidad: Especialidad) {
        this.id = especialidad.id;
        this.nombre = especialidad.nombre;
    }
}