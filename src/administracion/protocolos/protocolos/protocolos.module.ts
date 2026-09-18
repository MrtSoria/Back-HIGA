import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtocolosController } from './protocolos.controller.js';
import { ProtocolosService } from './protocolos.service.js';
import { ProtocolosRepository } from './protocolos.repository.js';
import { Protocolo } from './protocolos.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Protocolo,
    ]),
  ],

  controllers: [
    ProtocolosController,
  ],

  providers: [
    ProtocolosService,
    ProtocolosRepository,
  ],

  exports: [
    ProtocolosService,
  ],
})
export class ProtocolosModule {}