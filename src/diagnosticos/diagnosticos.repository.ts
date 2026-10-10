import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Diagnostico } from './diagnosticos.entity.js';
import { Especialidad } from '../especialidades/especialidades.entity.js';

@Injectable()
export class DiagnosticosRepository {
	constructor(
		@InjectRepository(Diagnostico)
		private readonly diagnosticoRepository: Repository<Diagnostico>,

		@InjectRepository(Especialidad)
		private readonly especialidadRepository: Repository<Especialidad>,
	) { }

	async buscarEspecialidades(ids: string[]): Promise<Especialidad[]> {
		if (ids.length === 0) return [];

		return this.especialidadRepository.find({
			where: { id: In(ids) }
		})
	}

	async buscarTodos(): Promise<Diagnostico[]> {
		return this.diagnosticoRepository.find({
			relations: {
				protocolo: true,
				especialidades: true,
			}
		});
	}

	async buscarPorId(id: string): Promise<Diagnostico | null> {
		return this.diagnosticoRepository.findOne({
			where: { id },
			relations: {
				protocolo: true,
				especialidades: true,
			}
		});
	}

	async crear(diagnostico: Diagnostico): Promise<Diagnostico> {
		return this.diagnosticoRepository.save(diagnostico);
	}

	async actualizar(
		id: string,
		datos: Partial<Diagnostico>,
	): Promise<Diagnostico | null> {
		await this.diagnosticoRepository.save({
			id,
			...datos
		});
		return this.buscarPorId(id);
	}

	async eliminar(id: string): Promise<void> {
		await this.diagnosticoRepository.delete(id);
	}
}
