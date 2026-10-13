import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller.js';
import { UsuariosService } from './usuarios.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuarios.entity.js';
import { Especialidad } from '../especialidades/especialidades.entity.js';
import { HistorialModule } from '../historial/historial.module.js';
import { UsuariosRepository } from './usuarios.repository.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Especialidad
    ]),
    HistorialModule
  ],

  controllers: [
    UsuariosController
  ],

  providers: [
    UsuariosService,
    UsuariosRepository
  ],

  exports: [
    UsuariosService
  ]
})
export class UsuariosModule { }
