import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { UsuariosRepository } from '../usuarios/usuarios.repository.js';
import { OMITIR_VALIDACION_USUARIO } from './usuario-existente.decorator.js';

@Injectable()
export class UsuarioExistenteGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly usuariosRepository: UsuariosRepository,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const omitirValidacion = this.reflector.getAllAndOverride<boolean>(
			OMITIR_VALIDACION_USUARIO,
			[context.getHandler(), context.getClass()],
		);

		if (omitirValidacion) {
			return true;
		}

		const request = context.switchToHttp().getRequest<Request>();

		if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
			return true;
		}

		const usuarioId = request.headers['x-user-id'];

		if (typeof usuarioId !== 'string' || !/^\d+$/.test(usuarioId)) {
			throw new UnauthorizedException(
				'Se requiere un identificador de usuario válido',
			);
		}

		const usuario = await this.usuariosRepository.buscarPorId(usuarioId);

		if (!usuario) {
			throw new UnauthorizedException(
				'El usuario no existe o fue eliminado',
			);
		}

		if (!usuario.is_admin) {
			throw new ForbiddenException(
				'Se requieren permisos de administrador para modificar datos',
			);
		}

		return true;
	}
}
