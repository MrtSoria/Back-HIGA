import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateProtocoloDto } from './dto/create-protocolo.dto.js';
import { UpdateProtocoloDto } from './dto/update-protocolo.dto.js';
import { Protocolo } from './protocolos.entity.js';
import { ProtocolosRepository } from './protocolos.repository.js';
import { DiagnosticosService } from '../diagnosticos/diagnosticos.service.js';

@Injectable()
export class ProtocolosService {

    constructor(
        private readonly repository: ProtocolosRepository,
        private readonly diagnosticosService: DiagnosticosService,
    ) { }

    async crear(
        dto: CreateProtocoloDto,
    ): Promise<Protocolo> {

        const protocolo = new Protocolo();

        protocolo.titulo = dto.titulo;
        protocolo.subtitulo = dto.subtitulo;
        protocolo.desc = dto.desc;

        const diagnostico = await this.diagnosticosService.buscarPorId(
            dto.diagnosticoId,
        );

        protocolo.diagnostico = diagnostico;

        return this.repository.crear(protocolo);
    }

    async buscarTodos(): Promise<Protocolo[]> {
        return this.repository.buscarTodos();
    }

    async buscarPorId(id: number): Promise<Protocolo> {

        const protocolo =
            await this.repository.buscarPorId(id);

        if (!protocolo) {
            throw new NotFoundException(
                `No existe el protocolo ${id}`,
            );
        }

        return protocolo;
    }


    async actualizar(
        id: number,
        dto: UpdateProtocoloDto,
    ): Promise<Protocolo> {

        await this.buscarPorId(id);

        const datos: Partial<Protocolo> = {
            titulo: dto.titulo,
            subtitulo: dto.subtitulo,
            desc: dto.desc,
        };

        if (dto.diagnosticoId !== undefined) {
            datos.diagnostico = await this.diagnosticosService.buscarPorId(
                dto.diagnosticoId,
            );
        }

        const actualizado = await this.repository.actualizar(id, datos);

        return actualizado!;
    }


    async eliminar(id: number): Promise<void> {

        await this.buscarPorId(id);

        await this.repository.eliminar(id);
    }
}