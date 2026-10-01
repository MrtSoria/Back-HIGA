import { Injectable } from '@nestjs/common';
import { Entidad, Operacion } from './historial.enums.js';
import { HistorialRepository } from './historial.repository.js';

@Injectable()
export class HistorialService {
    constructor(
        private readonly historialRepository: HistorialRepository,
    ) { }

    async registrarCambio(
        entidad: Entidad,
        id_entidad: string,
        operacion: Operacion,
    ) {
        return this.historialRepository.crear({
            entidad,
            id_entidad,
            operacion,
        });
    }
}