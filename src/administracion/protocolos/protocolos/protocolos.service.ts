import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProtocoloDto } from './dto/create-protocolo.dto.js';
import { UpdateProtocoloDto } from './dto/update-protocolo.dto.js';
import { Protocolo } from './protocolos.entity.js';
import { ProtocolosRepository } from './protocolos.repository.js';

@Injectable()
export class ProtocolosService {

    constructor(
        private readonly repository: ProtocolosRepository,
    ) {}

    async crear(
        dto: CreateProtocoloDto,
    ): Promise<Protocolo> {

        const protocolo = new Protocolo();

        protocolo.titulo = dto.titulo;
        protocolo.subtitulo = dto.subtitulo;
        protocolo.desc = dto.desc;

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

    //Importante agregar la busqueda por criterio, hay que ver bien como definirlo, va a ser la funcinoalidad principal 
    //Ver esto tambien en el repository

    async actualizar(
        id: number,
        dto: UpdateProtocoloDto,
    ): Promise<Protocolo> {

        await this.buscarPorId(id);

        const actualizado =
        await this.repository.actualizar(id, dto);

        return actualizado!;
    }


    async eliminar(id: number): Promise<void> {

        await this.buscarPorId(id);

        await this.repository.eliminar(id);
    }
}