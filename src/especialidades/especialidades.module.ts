import { Module } from '@nestjs/common';
import { EspecialidadesController } from './especialidades.controller.js';
import { EspecialidadesService } from './especialidades.service.js';
import { HistorialModule } from '../historial/historial.module.js';
import { EspecialidadesRepository } from './especialidades.repository.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidad } from '../especialidades/especialidades.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Especialidad
    ]),
    HistorialModule
  ],
  controllers: [
    EspecialidadesController
  ],
  providers: [
    EspecialidadesService,
    EspecialidadesRepository
  ]
})
export class EspecialidadesModule { }
