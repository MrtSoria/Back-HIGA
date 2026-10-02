import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cambio } from './historial.entity.js';
import { HistorialRepository } from './historial.repository.js';
import { HistorialService } from './historial.service.js';
import { HistorialController } from './historial.controller.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cambio]),
    ],

    controllers: [
        HistorialController
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
