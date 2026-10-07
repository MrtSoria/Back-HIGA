import { Injectable } from '@nestjs/common';
import { Cambio } from '../historial/historial.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Protocolo } from '../protocolos/protocolos.entity.js';
import { Diagnostico } from '../diagnosticos/diagnosticos.entity.js';
import { In } from 'typeorm'

@Injectable()
export class SyncRepository {
    constructor(
        @InjectRepository(Cambio)
        private readonly cambioRepository: Repository<Cambio>,

        @InjectRepository(Diagnostico)
        private readonly diagnosticoRepository: Repository<Diagnostico>,

        @InjectRepository(Protocolo)
        private readonly protocoloRepository: Repository<Protocolo>,
    ) { }

    async getSyncData(
        lastSync: string
    ): Promise<Cambio[]> {
        return this.cambioRepository.
            createQueryBuilder('cambio')
            .where('cambio.id > :lastSync',
                { lastSync }
            )
            .orderBy('cambio.id', 'ASC')
            .getMany();
    }

    async getDiagnosticos(ids: string[]): Promise<Diagnostico[]> {
        if (!ids || ids.length === 0) {
            return [];
        }

        return await this.diagnosticoRepository.find({
            where: {
                id: In(ids)
            },
            relations: { protocolo: true }
        })
    }

    async getProtocolos(ids: string[]): Promise<Protocolo[]> {
        if (!ids || ids.length === 0) {
            return [];
        }

        return await this.protocoloRepository.find({
            where: {
                id: In(ids)
            },
            relations: { diagnostico: true }
        });
    }
}