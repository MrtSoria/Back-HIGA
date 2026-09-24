import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnostico } from './diagnosticos/diagnosticos.entity.js';
import { Protocolo } from './protocolos/protocolos.entity.js';
import { ProtocolosModule } from './protocolos/protocolos.module.js';
import { DiagnosticosModule } from './diagnosticos/diagnosticos.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      //imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Diagnostico, Protocolo],
        synchronize: false,
        // Si se setea en true typeorm intentara crear las tablas en la base de datos, si no existen. Esto puede ser peligroso en producción.
      }),
    }),
    DiagnosticosModule,
    ProtocolosModule,
  ],
})
export class AppModule { }
