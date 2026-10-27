import { Especialidad } from "../especialidades.entity.js";

export class EspecialidadResponseDto {

    id: string;
    nombre: string;
    diagnosticos: any[];

    constructor(especialidad: Especialidad) {
        this.id = especialidad.id;
        this.nombre = especialidad.nombre;
        this.diagnosticos = especialidad.diagnosticos;
    }
}