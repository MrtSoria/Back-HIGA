import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnostico } from './diagnosticos/diagnosticos.entity.js';
import { Protocolo } from './protocolos/protocolos.entity.js';
import { ProtocolosModule } from './protocolos/protocolos.module.js';
import { DiagnosticosModule } from './diagnosticos/diagnosticos.module.js';
import { SyncModule } from './sync/sync.module.js';
import { HistorialModule } from './historial/historial.module.js';
import { Cambio } from './historial/historial.entity.js';
import { EspecialidadesModule } from './especialidades/especialidades.module.js';
import { Especialidad } from './especialidades/especialidades.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Diagnostico, Protocolo, Cambio, Especialidad],
        synchronize: false,
        // Si se setea en true typeorm intentara crear las tablas en la base de datos, si no existen. Esto puede ser peligroso en producción.
      }),
    }),
    DiagnosticosModule,
    ProtocolosModule,
    SyncModule,
    HistorialModule,
    EspecialidadesModule,
  ],
})
export class AppModule { }
