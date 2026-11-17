import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
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
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { Usuario } from './usuarios/usuarios.entity.js';
import { StorageModule } from './storage/storage.module.js';
import { UsuarioExistenteGuard } from './common/usuario-existente.guard.js';

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
        entities: [Diagnostico, Protocolo, Cambio, Especialidad, Usuario],
        synchronize: false,
        // Si se setea en true typeorm intentara crear las tablas en la base de datos, si no existen. Esto puede ser peligroso en producción.
      }),
    }),
    DiagnosticosModule,
    ProtocolosModule,
    SyncModule,
    HistorialModule,
    EspecialidadesModule,
    UsuariosModule,
    StorageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UsuarioExistenteGuard,
    },
  ],
})
export class AppModule { }
