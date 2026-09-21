import { Module } from '@nestjs/common';
import { DiagnosticosService } from './diagnosticos.service.js';
import { DiagnosticosController } from './diagnosticos.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnostico } from './diagnosticos.entity.js';
import { DiagnosticosRepository } from './diagnosticos.repository.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Diagnostico,
    ]),
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
export class DiagnosticosModule {}