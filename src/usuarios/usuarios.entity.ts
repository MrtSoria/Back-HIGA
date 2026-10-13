import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable
} from "typeorm";
import type { Relation } from "typeorm";
import { Especialidad } from "../especialidades/especialidades.entity.js";

@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column({ length: 50 })
    nombre: string;

    @Column({ length: 50 })
    apellido: string;

    @Column({ type: 'boolean', default: false })
    is_admin: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    creado: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    modificado: Date;

    @ManyToMany(() => Especialidad, (especialidad) => especialidad.usuarios)
    @JoinTable({
        name: 'usuarios_especialidades',
        joinColumn: { name: 'id_usuario' },
        inverseJoinColumn: { name: 'id_especialidad' }
    })
    especialidades: Relation<Especialidad[]>;
}