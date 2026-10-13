import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Usuario } from "./usuarios.entity.js";
import { Especialidad } from "../especialidades/especialidades.entity.js";

@Injectable()
export class UsuariosRepository {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,

        @InjectRepository(Especialidad)
        private readonly especialidadRepository: Repository<Especialidad>,
    ) { }

    async buscarEspecialidades(ids: string[]): Promise<Especialidad[]> {
        if (ids.length === 0) return [];

        return this.especialidadRepository.find({
            where: { id: In(ids) }
        })
    }

    async buscarEspecialidadesPorUsuario(userId: string): Promise<Especialidad[]> {
        const user = await this.usuarioRepository.findOne({
            where: { id: userId },
            relations: {
                especialidades: true
            }
        })
        return user?.especialidades ?? [];
    }

    async buscarTodos(): Promise<Usuario[]> {
        return this.usuarioRepository.find({
            relations: {
                especialidades: true,
            }
        });
    }

    async buscarPorId(id: string): Promise<Usuario | null> {
        return this.usuarioRepository.findOne({
            where: { id },
            relations: {
                especialidades: true,
            }
        });
    }

    async crear(user: Usuario): Promise<Usuario> {
        return this.usuarioRepository.save(user);
    }

    async actualizar(
        id: string,
        datos: Partial<Usuario>,
    ): Promise<Usuario | null> {
        await this.usuarioRepository.save({
            id,
            ...datos
        });
        return this.buscarPorId(id);
    }

    async eliminar(id: string): Promise<void> {
        await this.usuarioRepository.delete(id);
    }
}