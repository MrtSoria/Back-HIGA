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
    ) {
        return this.repository.crear({
            entidad,
            id_entidad,
            operacion,
        });
    }

    async buscarTodos() {
        return this.repository.buscarTodos();
    }
}