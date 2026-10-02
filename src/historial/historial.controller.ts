import { Controller, Get } from '@nestjs/common';
import { HistorialService } from './historial.service.js';
import { CambioResponseDto } from './dto/historial-response.dto.js';

@Controller('cambios')
export class HistorialController {
    constructor(
        private readonly service: HistorialService,
    ) { }

    @Get()
    async buscarTodos() {
        const cambios = await this.service.buscarTodos();

        return cambios.map(
            cambio => new CambioResponseDto(cambio),
        );
    }
}
