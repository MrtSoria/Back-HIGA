import {
	Injectable,
	NotFoundException,
	BadRequestException
} from '@nestjs/common';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto.js';
import { UpdateDiagnosticoDto } from './dto/update-diagnostic.dto.js';
import { Diagnostico } from './diagnosticos.entity.js';
import { DiagnosticosRepository } from './diagnosticos.repository.js';
import { HistorialService } from '../historial/historial.service.js';
import { Entidad, Operacion } from '../historial/historial.enums.js';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception.js';

@Injectable()
export class DiagnosticosService {

	constructor(
		private readonly repository: DiagnosticosRepository,
		private readonly historialService: HistorialService,
	) { }

	async crear(
		dto: CreateDiagnosticoDto,
	): Promise<Diagnostico> {

		const diagnostico = new Diagnostico();

		diagnostico.titulo = dto.titulo;
		diagnostico.desc = dto.desc;

		const creado = await this.repository.crear(diagnostico);

		await this.historialService.registrarCambio(
			Entidad.DIAGNOSTICO,
			creado.id,
			Operacion.CREATE,
		);

		return creado;
	}

	async buscarTodos(): Promise<Diagnostico[]> {
		return this.repository.buscarTodos();
	}

	async buscarPorId(id: string): Promise<Diagnostico> {
		const diagnostico = await this.repository.buscarPorId(id);

		if (!diagnostico) {
			throw new NotFoundException(
				`No existe el diagnóstico ${id}`,
			);
		}
		return diagnostico;
	}

	async actualizar(
		id: string,
		dto: UpdateDiagnosticoDto,
	): Promise<Diagnostico> {
		await this.buscarPorId(id);

		const actualizado = await this.repository.actualizar(id, dto);

		if (!actualizado) {
			throw new InternalServerErrorException(
				`No se pudo actualizar el diagnóstico ${id}`,
			);
		}

		await this.historialService.registrarCambio(
			Entidad.DIAGNOSTICO,
			actualizado.id,
			Operacion.UPDATE,
		);

		return actualizado;
	}

	async eliminar(id: string): Promise<void> {
		const diagnostico = await this.buscarPorId(id);

		if (diagnostico.protocolo) {
			throw new BadRequestException(
				`No se puede eliminar el diagnóstico ${id} porque está asociado a un protocolo`,
			);
		}

		await this.repository.eliminar(id);

		await this.historialService.registrarCambio(
			Entidad.DIAGNOSTICO,
			id,
			Operacion.DELETE,
		);
	}
}
