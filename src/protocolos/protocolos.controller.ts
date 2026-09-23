import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProtocolosService } from './protocolos.service.js';
import { CreateProtocoloDto } from './dto/create-protocolo.dto.js';
import { UpdateProtocoloDto } from './dto/update-protocolo.dto.js';
import { ProtocoloResponseDto } from './dto/protocol-response.dto.js';


@Controller('protocolos')
export class ProtocolosController {

    constructor(
        private readonly service: ProtocolosService,
    ) {}

    @Post()
    async crear(
        @Body() dto: CreateProtocoloDto,
    ) {

        const protocolo =
        await this.service.crear(dto);

        return new ProtocoloResponseDto(protocolo);
    }

    @Get()
    async buscarTodos() {

        const protocolos =
        await this.service.buscarTodos();

        return protocolos.map(
        protocolo =>
            new ProtocoloResponseDto(protocolo),
        );
    }

    @Get(':id')
    async buscarPorId(
        @Param('id', ParseIntPipe) id: number,
    ) {

        const protocolo =
        await this.service.buscarPorId(id);

        return new ProtocoloResponseDto(protocolo);
    }

    @Patch(':id')
    async actualizar(
        @Param('id', ParseIntPipe) id: number,

        @Body() dto: UpdateProtocoloDto,
    ) {

        const protocolo =
        await this.service.actualizar(id, dto);

        return new ProtocoloResponseDto(protocolo);
    }

    @Delete(':id')
    async eliminar(
        @Param('id', ParseIntPipe) id: number,
    ) {

        await this.service.eliminar(id);

        return {
        mensaje: 'Protocolo eliminado correctamente',
        };
    }
}