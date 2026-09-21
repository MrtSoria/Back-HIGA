import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Diagnostico } from './diagnosticos.entity.js';

@Injectable()
export class DiagnosticosRepository {
	constructor(
		@InjectRepository(Diagnostico)
		private readonly diagnosticoRepository: Repository<Diagnostico>,
	) {}

	async buscarTodos(): Promise<Diagnostico[]> {
		return this.diagnosticoRepository.find();
	}

	async buscarPorId(id: number): Promise<Diagnostico | null> {
		return this.diagnosticoRepository.findOne({ where: { id } });
	}

	async crear(diagnostico: Diagnostico): Promise<Diagnostico> {
		return this.diagnosticoRepository.save(diagnostico);
	}

    async actualizar(
        id: number,
        datos: Partial<Diagnostico>,
    ): Promise<Diagnostico | null> {
        await this.diagnosticoRepository.update(id, datos);
        return this.buscarPorId(id);
    }
    
    async eliminar(id: number): Promise<void> {
        await this.diagnosticoRepository.delete(id);
    }
}
