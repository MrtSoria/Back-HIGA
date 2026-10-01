import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cambio } from './historial.entity.js';

@Injectable()
export class HistorialRepository {
    constructor(
        @InjectRepository(Cambio)
        private readonly historialRepository: Repository<Cambio>,
    ) { }

    async crear(cambio: Partial<Cambio>): Promise<Cambio> {
        const nuevoCambio = this.historialRepository.create(cambio);
        return this.historialRepository.save(nuevoCambio);
    }

    async buscarTodos(): Promise<Cambio[]> {
        return this.historialRepository.find();
    }
}