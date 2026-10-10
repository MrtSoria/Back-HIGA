import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Diagnostico } from '../diagnosticos/diagnosticos.entity.js';

@Entity('especialidades')
export class Especialidad {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column({ length: 100, unique: true })
    nombre: string;

    @ManyToMany(() => Diagnostico, (diagnostico) => diagnostico.especialidades)
    diagnosticos: Relation<Diagnostico[]>;

    @CreateDateColumn({ type: 'timestamptz' })
    creado: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    modificado: Date;
}