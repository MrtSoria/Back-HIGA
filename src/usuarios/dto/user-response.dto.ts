import { EspecialidadResponseDto } from '../../especialidades/dto/especialidad-response.dto.js';
import { Usuario } from '../usuarios.entity.js';

export class UserResponseDto {

    id: string;
    nombre: string;
    apellido: string;
    is_admin: boolean;
    especialidades: EspecialidadResponseDto[];

    constructor(user: Usuario) {
        this.id = user.id;
        this.nombre = user.nombre;
        this.apellido = user.apellido;
        this.is_admin = user.is_admin;
        this.especialidades = user.especialidades.map(
            (especialidad) => new EspecialidadResponseDto(especialidad)
        );
    }
}