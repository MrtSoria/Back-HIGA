import { Injectable } from '@nestjs/common';
import { EspecialidadesRepository } from './especialidades.repository.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { Especialidad } from './especialidades.entity.js';
import { Entidad, Operacion } from '../historial/historial.enums.js';
import { HistorialService } from '../historial/historial.service.js';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';
import { DataSource, IsNull } from 'typeorm';
import { Cambio } from '../historial/historial.entity.js';

@Injectable()
export class EspecialidadesService {
    constructor(
        private readonly repository: EspecialidadesRepository,
        private readonly historialService: HistorialService,
        private readonly dataSource: DataSource
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
        await this.dataSource.transaction(
            async manager => {
                const especialidades = manager.getRepository(Especialidad);
                const cambios = manager.getRepository(Cambio);

                const especialidad = await especialidades.findOne({
                    where: {
                        id,
                        deleted_at: IsNull(),
                    },
                    lock: {
                        mode: 'pessimistic_write'
                    },
                });

                if (!especialidad) {
                    throw new NotFoundException(`No existe la especialidad ${id}`);
                }

                especialidad.deleted_at = new Date();
                await especialidades.save(especialidad);

                const cambio = cambios.create({
                    entidad: Entidad.ESPECIALIDAD,
                    id_entidad: id,
                    operacion: Operacion.DELETE,
                });

                await cambios.save(cambio);
            }
        );
    }
}
