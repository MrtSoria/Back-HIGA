import { Injectable } from '@nestjs/common';
import { Cambio } from '../historial/historial.entity.js';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { Protocolo } from '../protocolos/protocolos.entity.js';
import { Diagnostico } from '../diagnosticos/diagnosticos.entity.js';

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

    async getLastSync(): Promise<string> {
        const ultimoCambio = await this.cambioRepository.findOne({
            order: { id: 'DESC' },
        });
        return ultimoCambio?.id ?? '0';
    }

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
        return this.diagnosticoRepository.find({
            //where: { id: In<string>(ids) },
            relations: { protocolo: true },
        });
    }

    async getProtocolos(ids: string[]): Promise<Protocolo[]> {
        return this.protocoloRepository.find({
            //where: { id: In<string>(ids) },
        });
    }
}