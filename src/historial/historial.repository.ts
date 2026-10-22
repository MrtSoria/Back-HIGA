import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cambio } from './historial.entity.js';
import { Especialidad } from '../especialidades/especialidades.entity.js';

@Injectable()
export class HistorialRepository {
    constructor(
        @InjectRepository(Cambio)
        private readonly historialRepository: Repository<Cambio>,

        @InjectRepository(Especialidad)
        private readonly especialidadRepository: Repository<Especialidad>,
    ) { }

    async crear(
        cambio: Partial<Cambio>,
        ids_especialidades: string[] = [],
    ): Promise<Cambio> {
        const nuevoCambio = this.historialRepository.create(cambio);

        const idsUnicos = [...new Set(ids_especialidades)];

        if (idsUnicos.length > 0) {
            const especialidades = await this.especialidadRepository.findBy({
                id: In(idsUnicos),
            });

            if (especialidades.length !== idsUnicos.length) {
                throw new NotFoundException(
                    'Una o más especialidades no existen',
                );
            }

            nuevoCambio.especialidades = especialidades;
        }

        return this.historialRepository.save(nuevoCambio);
    }

    async buscarTodos(): Promise<Cambio[]> {
        return this.historialRepository.find({
            relations: {
                especialidades: true,
            },
        });
    }
}