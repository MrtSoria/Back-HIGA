import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnostico } from './diagnosticos.entity.js';

@Injectable()
export class DiagnosticosRepository {
	constructor(
		@InjectRepository(Diagnostico)
		private readonly diagnosticoRepository: Repository<Diagnostico>,
	) { }

	async buscarTodos(): Promise<Diagnostico[]> {
		return this.diagnosticoRepository.find({
			relations: { protocolo: true },
		});
	}

	async buscarPorId(id: string): Promise<Diagnostico | null> {
		return this.diagnosticoRepository.findOne({ where: { id }, relations: { protocolo: true } });
	}

	async crear(diagnostico: Diagnostico): Promise<Diagnostico> {
		return this.diagnosticoRepository.save(diagnostico);
	}

	async actualizar(
		id: string,
		datos: Partial<Diagnostico>,
	): Promise<Diagnostico | null> {
		await this.diagnosticoRepository.update(id, datos);
		return this.buscarPorId(id);
	}

	async eliminar(id: string): Promise<void> {
		await this.diagnosticoRepository.delete(id);
	}
}
