import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuariosRepository } from './usuarios.repository.js';
import { Usuario } from './usuarios.entity.js';
import { Especialidad } from '../especialidades/especialidades.entity.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

@Injectable()
export class UsuariosService {
    constructor(
        private readonly repository: UsuariosRepository,
    ) { }

    async buscarTodos(): Promise<Usuario[]> {
        return this.repository.buscarTodos();
    }

    async buscarPorId(id: string): Promise<Usuario> {
        const user = await this.repository.buscarPorId(id);

        if (!user) {
            throw new NotFoundException(`No existe el usuario ${id}`);
        }
        return user;
    }
    async validarLogin(username: string, pass: string): Promise<Usuario> {
        const user = await this.repository.buscarPorUsername(username);

        if (!user || user.password !== pass) {
            throw new NotFoundException('Credenciales inválidas');
        }

        return user;
    }

    async crear(dto: CreateUsuarioDto): Promise<Usuario> {
        const user = new Usuario();
        user.nombre = dto.nombre;
        user.apellido = dto.apellido;
        user.username = dto.username; 
        user.password = dto.password;
        user.is_admin = dto.is_admin ?? false;

        const especialidades = await this.repository.buscarEspecialidades(
            dto.especialidades,
        );

        if (especialidades.length !== dto.especialidades.length) {
            throw new NotFoundException(`Una o mas especialidades no existen`);
        }

        user.especialidades = especialidades;

        return this.repository.crear(user);
    }

    async actualizar(id: string, dto: UpdateUsuarioDto): Promise<Usuario> {
        await this.buscarPorId(id);

        const { especialidades: idsEspecialidades, ...campos } = dto;
        const datos: Partial<Usuario> = { ...campos };

        if (idsEspecialidades !== undefined) {
            const especialidades = await this.repository.buscarEspecialidades(
                idsEspecialidades,
            );

            if (especialidades.length !== idsEspecialidades.length) {
                throw new NotFoundException('Una o más especialidades no existen');
            }

            datos.especialidades = especialidades;
        }

        const actualizado = await this.repository.actualizar(id, datos);

        if (!actualizado) {
            throw new NotFoundException(`No se pudo actualizar el usuario ${id}`);
        }

        return actualizado;
    }

    async eliminar(id: string): Promise<void> {
        await this.buscarPorId(id);
        await this.repository.eliminar(id);
    }

    async buscarEspecialidadesPorUsuario(
        userId: string
    ): Promise<Especialidad[]> {
        await this.buscarPorId(userId);
        return this.repository.buscarEspecialidadesPorUsuario(userId);
    }
}
