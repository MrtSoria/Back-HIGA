import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Entidad, Operacion } from '../historial/historial.enums.js';
import { Especialidad } from '../especialidades/especialidades.entity.js';

@Entity('cambios')
export class Cambio {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar' })
  entidad: Entidad;

  @Column({ type: 'bigint' })
  id_entidad: string;

  @Column({ type: 'varchar' })
  operacion: Operacion;

  @CreateDateColumn({ type: 'timestamptz' })
  creado: Date;

  @ManyToMany(() => Especialidad)
  @JoinTable({
    name: 'cambios_especialidades',
    joinColumn: {
      name: 'id_cambio',
    },
    inverseJoinColumn: {
      name: 'id_especialidad',
    },
  })
  especialidades: Relation<Especialidad[]>;
}