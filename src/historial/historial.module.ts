import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cambio } from './historial.entity.js';
import { HistorialRepository } from './historial.repository.js';
import { HistorialService } from './historial.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cambio]),
    ],
    providers: [
        HistorialService,
        HistorialRepository,
    ],
    exports: [
        HistorialService,
    ],
})
export class HistorialModule { }
