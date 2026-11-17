import {
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Usuario } from '../usuarios/usuarios.entity.js';
import { UsuariosRepository } from '../usuarios/usuarios.repository.js';
import { OmitirValidacionUsuario } from './usuario-existente.decorator.js';
import { UsuarioExistenteGuard } from './usuario-existente.guard.js';

class LoginController {
	@OmitirValidacionUsuario()
	login(this: void) { }
}

function crearContexto(
	method: string,
	headers: Record<string, string | string[] | undefined> = {},
	handler: Function = () => undefined,
	controller: Function = LoginController,
): ExecutionContext {
	const request = { method, headers };

	return {
		getHandler: () => handler,
		getClass: () => controller,
		switchToHttp: () => ({
			getRequest: () => request,
		}),
	} as ExecutionContext;
}

describe('UsuarioExistenteGuard', () => {
	const buscarPorId = vi.fn(async (): Promise<Usuario | null> => null);
	const repository = { buscarPorId } as unknown as UsuariosRepository;
	const guard = new UsuarioExistenteGuard(new Reflector(), repository);

	beforeEach(() => {
		buscarPorId.mockReset();
		buscarPorId.mockResolvedValue(null);
	});

	it('rechaza una modificación sin identificador de usuario', async () => {
		await expect(
			guard.canActivate(crearContexto('PATCH')),
		).rejects.toBeInstanceOf(UnauthorizedException);
		expect(buscarPorId).not.toHaveBeenCalled();
	});

	it('rechaza una modificación cuyo usuario ya no existe', async () => {
		await expect(
			guard.canActivate(crearContexto('DELETE', {
				'x-user-id': '42',
			})),
		).rejects.toBeInstanceOf(UnauthorizedException);
		expect(buscarPorId).toHaveBeenCalledWith('42');
	});

	it('permite modificar cuando el usuario existe', async () => {
		buscarPorId.mockResolvedValue(new Usuario());

		await expect(
			guard.canActivate(crearContexto('POST', {
				'x-user-id': '42',
			})),
		).resolves.toBe(true);
	});

	it('no exige usuario para las lecturas ni el login', async () => {
		await expect(
			guard.canActivate(crearContexto('GET')),
		).resolves.toBe(true);
		await expect(
			guard.canActivate(crearContexto(
				'POST',
				{},
				LoginController.prototype.login,
				LoginController,
			)),
		).resolves.toBe(true);
		expect(buscarPorId).not.toHaveBeenCalled();
	});
});
