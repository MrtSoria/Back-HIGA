import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller.js';
import { SyncService } from './sync.service.js';
import { SyncRepository } from './sync.repository.js';
import { Cambio } from '../historial/historial.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Protocolo } from '../protocolos/protocolos.entity.js';
import { Diagnostico } from '../diagnosticos/diagnosticos.entity.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { EspecialidadesModule } from '../especialidades/especialidades.module.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Cambio,
            Diagnostico,
            Protocolo
        ]),
        UsuariosModule,
        EspecialidadesModule
    ],

    controllers: [
        SyncController
    ],

    providers: [
        SyncService,
        SyncRepository,
    ],
})
export class SyncModule { }