import { Injectable } from '@nestjs/common';
import { EspecialidadesRepository } from './especialidades.repository.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { Especialidad } from './especialidades.entity.js';
import { Entidad, Operacion } from '../historial/historial.enums.js';
import { HistorialService } from '../historial/historial.service.js';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';

@Injectable()
export class EspecialidadesService {
    constructor(
        private readonly repository: EspecialidadesRepository,
        private readonly historialService: HistorialService,
    ) { }

    async crear(
        dto: CreateEspecialidadDto,
    ): Promise<Especialidad> {

        const especialidad = new Especialidad();
        especialidad.nombre = dto.nombre;

        const creado = await this.repository.crear(especialidad);

        await this.historialService.registrarCambio(
            Entidad.ESPECIALIDAD,
            creado.id,
            Operacion.CREATE,
        );

        return creado;
    }

    async buscarTodos(): Promise<Especialidad[]> {
        return this.repository.buscarTodos();
    }

    async buscarPorId(id: string): Promise<Especialidad> {
        const especialidad = await this.repository.buscarPorId(id);

        if (!especialidad) {
            throw new NotFoundException(
                `No existe la especialidad ${id}`,
            );
        }
        return especialidad;
    }

    async actualizar(
        id: string,
        dto: UpdateEspecialidadDto,
    ): Promise<Especialidad> {
        await this.buscarPorId(id);

        const actualizado = await this.repository.actualizar(id, dto);

        if (!actualizado) {
            throw new InternalServerErrorException(
                `No se pudo actualizar la especialidad ${id}`,
            );
        }

        await this.historialService.registrarCambio(
            Entidad.ESPECIALIDAD,
            actualizado.id,
            Operacion.UPDATE,
        );

        return actualizado;
    }

    async eliminar(id: string): Promise<void> {
        //const especialidad = await this.buscarPorId(id);

        await this.repository.eliminar(id);

        await this.historialService.registrarCambio(
            Entidad.ESPECIALIDAD,
            id,
            Operacion.DELETE,
        );
    }
}
