import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Protocolo } from './protocolos.entity.js';

@Injectable()
export class ProtocolosRepository {

    constructor(
        @InjectRepository(Protocolo)
        private protocoloRepository: Repository<Protocolo>,
    ) { }

    async crear(protocolo: Protocolo): Promise<Protocolo> {
        return this.protocoloRepository.save(protocolo);
    }

    async buscarTodos(): Promise<Protocolo[]> {
        return this.protocoloRepository.find({
            relations: {
                id_diagnostico: true,
            },
        });
    }

    async buscarPorId(id: string): Promise<Protocolo | null> {
        return this.protocoloRepository.findOne({
            where: { id },
            relations: {
                id_diagnostico: true,
            },
        });
    }

    async actualizar(
        id: string,
        datos: Partial<Protocolo>,
    ): Promise<Protocolo | null> {
        await this.protocoloRepository.update(id, datos);
        return this.buscarPorId(id);
    }

    async eliminar(id: string): Promise<void> {
        await this.protocoloRepository.delete(id);
    }
}