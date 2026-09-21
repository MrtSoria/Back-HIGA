import { Module } from '@nestjs/common';
import { ProtocolosModule } from './protocolos/protocolos/protocolos.module.js';
import { DiagnosticosModule } from './protocolos/diagnosticos/diagnosticos.module.js';

@Module({
  imports: [ProtocolosModule, DiagnosticosModule]
})
export class AdministracionModule {}
