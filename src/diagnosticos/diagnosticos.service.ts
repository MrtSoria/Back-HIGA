import {
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto.js';
import { UpdateDiagnosticoDto } from './dto/update-protocol.dto.js';
import { Diagnostico } from './diagnosticos.entity.js';
import { DiagnosticosRepository } from './diagnosticos.repository.js';

@Injectable()
export class DiagnosticosService {

	constructor(
		private readonly repository: DiagnosticosRepository,
	) {}

	async crear(
		dto: CreateDiagnosticoDto,
	): Promise<Diagnostico> {
		const diagnostico = new Diagnostico();

		diagnostico.titulo = dto.titulo;
		diagnostico.desc = dto.desc;

		return this.repository.crear(diagnostico);
	}

	async buscarTodos(): Promise<Diagnostico[]> {
		return this.repository.buscarTodos();
	}

	async buscarPorId(id: number): Promise<Diagnostico> {
		const diagnostico = await this.repository.buscarPorId(id);

		if (!diagnostico) {
			throw new NotFoundException(
				`No existe el diagnóstico ${id}`,
			);
		}

		return diagnostico;
	}

	async actualizar(
		id: number,
		dto: UpdateDiagnosticoDto,
	): Promise<Diagnostico> {
		await this.buscarPorId(id);

		const actualizado = await this.repository.actualizar(id, dto);

		return actualizado!;
	}

	async eliminar(id: number): Promise<void> {
		await this.buscarPorId(id);

		await this.repository.eliminar(id);
	}
}
