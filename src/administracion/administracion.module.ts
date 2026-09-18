import { Module } from '@nestjs/common';
import { ProtocolosModule } from './protocolos/protocolos/protocolos.module.js';

@Module({
  imports: [ProtocolosModule]
})
export class AdministracionModule {}
