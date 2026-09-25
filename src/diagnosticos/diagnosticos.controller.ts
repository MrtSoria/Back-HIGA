import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { DiagnosticosService } from './diagnosticos.service.js';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto.js';
import { DiagnosticoResponseDto } from './dto/diagnostic-response.dto.js';
import { UpdateDiagnosticoDto } from './dto/update-protocol.dto.js';

@Controller('diagnosticos')
export class DiagnosticosController {

	constructor(
		private readonly service: DiagnosticosService,
	) { }

	@Post()
	async crear(
		@Body() dto: CreateDiagnosticoDto,
	) {
		const diagnostico = await this.service.crear(dto);

		return new DiagnosticoResponseDto(diagnostico);
	}

	@Get()
	async buscarTodos() {
		const diagnosticos = await this.service.buscarTodos();

		return diagnosticos.map(
			diagnostico => new DiagnosticoResponseDto(diagnostico),
		);
	}

	@Get(':id')
	async buscarPorId(
		@Param('id', ParseIntPipe) id: number,
	) {
		const diagnostico = await this.service.buscarPorId(id);

		return new DiagnosticoResponseDto(diagnostico);
	}

	@Patch(':id')
	async actualizar(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateDiagnosticoDto,
	) {
		const diagnostico = await this.service.actualizar(id, dto);

		return new DiagnosticoResponseDto(diagnostico);
	}

	@Delete(':id')
	async eliminar(
		@Param('id', ParseIntPipe) id: number,
	) {
		await this.service.eliminar(id);

		return {
			mensaje: 'Diagnóstico eliminado correctamente',
		};
	}
}
