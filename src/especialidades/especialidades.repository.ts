import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Especialidad } from "./especialidades.entity.js";
import { Repository } from 'typeorm';

@Injectable()
export class EspecialidadesRepository {
    constructor(
        @InjectRepository(Especialidad)
        private readonly especialidadRepository: Repository<Especialidad>,
    ) { }

    async buscarTodos(): Promise<Especialidad[]> {
        return this.especialidadRepository.find();
    }

    async buscarPorId(id: string): Promise<Especialidad | null> {
        return this.especialidadRepository.findOne({ where: { id } });
    }

    async crear(especialidad: Especialidad): Promise<Especialidad> {
        return this.especialidadRepository.save(especialidad);
    }

    async actualizar(
        id: string,
        datos: Partial<Especialidad>,
    ): Promise<Especialidad | null> {
        await this.especialidadRepository.update(id, datos);
        return this.buscarPorId(id);
    }

    async eliminar(id: string): Promise<void> {
        await this.especialidadRepository.delete(id);
    }
}