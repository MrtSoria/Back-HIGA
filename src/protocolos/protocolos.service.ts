import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateProtocoloDto } from './dto/create-protocolo.dto.js';
import { UpdateProtocoloDto } from './dto/update-protocolo.dto.js';
import { Protocolo } from './protocolos.entity.js';
import { ProtocolosRepository } from './protocolos.repository.js';
import { DiagnosticosService } from '../diagnosticos/diagnosticos.service.js';
import { HistorialService } from '../historial/historial.service.js';
import { Entidad, Operacion } from '../historial/historial.enums.js';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception.js';

@Injectable()
export class ProtocolosService {

    constructor(
        private readonly repository: ProtocolosRepository,
        private readonly diagnosticosService: DiagnosticosService,
        private readonly historialService: HistorialService,
    ) { }

    async crear(
        dto: CreateProtocoloDto,
    ): Promise<Protocolo> {
        const diagnostico = await this.diagnosticosService.buscarPorId(
            dto.id_diagnostico,
        );

        const protocolo = new Protocolo();

        protocolo.subtitulo = dto.subtitulo;
        protocolo.desc = dto.desc;
        protocolo.diagnostico = diagnostico;

        const creado = await this.repository.crear(protocolo);

        await this.historialService.registrarCambio(
            Entidad.PROTOCOLO,
            creado.id,
            Operacion.CREATE,
            diagnostico.especialidades.map(e => e.id),
        );

        return creado;
    }

    async buscarTodos(): Promise<Protocolo[]> {
        return this.repository.buscarTodos();
    }

    async buscarPorId(id: string): Promise<Protocolo> {

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
        id: string,
        dto: UpdateProtocoloDto,
    ): Promise<Protocolo> {
        const protocoloAnterior = await this.buscarPorId(id);

        const datos: Partial<Protocolo> = {
            subtitulo: dto.subtitulo,
            desc: dto.desc,
        };

        if (dto.id_diagnostico !== undefined) {
            datos.diagnostico = await this.diagnosticosService.buscarPorId(
                dto.id_diagnostico,
            );
        }

        const actualizado = await this.repository.actualizar(id, datos);

        if (!actualizado) {
            throw new InternalServerErrorException(
                `No se pudo actualizar el protocolo ${id}`,
            );
        }

        const ids_especialidades = [
            ...new Set([
                ...protocoloAnterior.diagnostico.especialidades.map(e => e.id),
                ...(actualizado.diagnostico?.especialidades ?? []).map(e => e.id),
            ]),
        ];

        await this.historialService.registrarCambio(
            Entidad.PROTOCOLO,
            actualizado.id,
            Operacion.UPDATE,
            ids_especialidades,
        );

        return actualizado;
    }

    async eliminar(id: string): Promise<void> {
        const protocolo = await this.buscarPorId(id);

        const ids_especialidades = protocolo.diagnostico.especialidades.map(
            e => e.id,
        );

        await this.repository.eliminar(id);

        await this.historialService.registrarCambio(
            Entidad.PROTOCOLO,
            id,
            Operacion.DELETE,
            ids_especialidades,
        );
    }
}