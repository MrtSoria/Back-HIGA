import { Injectable } from '@nestjs/common';
import { Entidad, Operacion } from './historial.enums.js';
import { HistorialRepository } from './historial.repository.js';

@Injectable()
export class HistorialService {
    constructor(
        private readonly repository: HistorialRepository,
    ) { }

    async registrarCambio(
        entidad: Entidad,
        id_entidad: string,
        operacion: Operacion,
        ids_especialidades: string[] = [],
    ) {
        return this.repository.crear(
            {
                entidad,
                id_entidad,
                operacion,
            },
            ids_especialidades,
        );
    }

    async buscarTodos() {
        return this.repository.buscarTodos();
    }
}