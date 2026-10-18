import { Controller, Param, Get, Post, Delete, Body, Patch } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly service: UsuariosService) { }

    @Get()
    async buscarTodos() {
        const users = await this.service.buscarTodos();

        return users.map(
            user => new UserResponseDto(user)
        );
    }

    @Get(':id')
    async buscarPorId(
        @Param('id') id: string
    ) {
        const user = await this.service.buscarPorId(id);

        return new UserResponseDto(user);
    }

    @Post()
    async crear(
        @Body() dto: CreateUsuarioDto
    ) {
        const user = await this.service.crear(dto)

        return new UserResponseDto(user);
    }
    
    @Post('login')
    async login(
        @Body() body: { username: string; password: string }
    ) {
        const user = await this.service.validarLogin(body.username, body.password);
        return {
            usuario: new UserResponseDto(user)
        };
    }

    @Patch(':id')
    async actualizar(
        @Param('id') id: string,
        @Body() dto: UpdateUsuarioDto
    ) {
        const user = await this.service.actualizar(id, dto);

        return new UserResponseDto(user);
    }

    @Delete(':id')
    async eliminar(
        @Param('id') id: string
    ) {
        await this.service.eliminar(id);

        return {
            mensaje: 'Usuario eliminado correctamente',
        };
    }
}
