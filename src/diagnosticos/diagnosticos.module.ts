import { Module } from '@nestjs/common';
import { DiagnosticosService } from './diagnosticos.service.js';
import { DiagnosticosController } from './diagnosticos.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnostico } from './diagnosticos.entity.js';
import { DiagnosticosRepository } from './diagnosticos.repository.js';
import { HistorialModule } from '../historial/historial.module.js';
import { Especialidad } from '../especialidades/especialidades.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Diagnostico,
      Especialidad
    ]),
    HistorialModule,
  ],

  controllers: [
    DiagnosticosController,
  ],

  providers: [
    DiagnosticosService,
    DiagnosticosRepository,
  ],

  exports: [
    DiagnosticosService,
  ],
})
export class DiagnosticosModule { }