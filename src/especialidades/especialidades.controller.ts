import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';
import { EspecialidadResponseDto } from './dto/especialidad-response.dto.js';

@Controller('especialidades')
export class EspecialidadesController {

    constructor(
        private readonly service: EspecialidadesService,
    ) { }

    @Post()
    async crear(
        @Body() dto: CreateEspecialidadDto,
    ) {
        const diagnostico = await this.service.crear(dto);

        return new EspecialidadResponseDto(diagnostico);
    }

    @Get()
    async buscarTodos() {
        const especialidades = await this.service.buscarTodos();

        return especialidades.map(
            especialidad => new EspecialidadResponseDto(especialidad),
        );
    }

    @Get(':id')
    async buscarPorId(
        @Param('id') id: string,
    ) {
        const especialidad = await this.service.buscarPorId(id);

        return new EspecialidadResponseDto(especialidad);
    }

    @Patch(':id')
    async actualizar(
        @Param('id') id: string,
        @Body() dto: UpdateEspecialidadDto,
    ) {
        const especialidad = await this.service.actualizar(id, dto);

        return new EspecialidadResponseDto(especialidad);
    }

    @Delete(':id')
    async eliminar(
        @Param('id') id: string,
    ) {
        await this.service.eliminar(id);

        return {
            mensaje: 'Especialidad eliminada correctamente',
        };
    }

}
