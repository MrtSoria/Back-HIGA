import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministracionModule } from './administracion/administracion.module.js';
import { Protocolo } from './administracion/protocolos/protocolos/protocolos.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [
        Protocolo
      ],
      synchronize: true,
    }),
    AdministracionModule],
  providers: [],
})
export class AppModule { }
