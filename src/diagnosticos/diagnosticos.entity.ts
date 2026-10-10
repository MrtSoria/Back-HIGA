import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Protocolo } from '../protocolos/protocolos.entity.js';
import { Especialidad } from '../especialidades/especialidades.entity.js';

@Entity('diagnosticos')
export class Diagnostico {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 150, unique: true })
  titulo: string;

  @Column({ type: 'text' })
  desc: string;

  @OneToOne(() => Protocolo, (protocolo) => protocolo.diagnostico)
  protocolo: Relation<Protocolo>;

  @ManyToMany(() => Especialidad, (especialidad) => especialidad.diagnosticos)
  @JoinTable({
    name: 'diagnosticos_especialidades',
    joinColumn: { name: 'id_diagnostico' },
    inverseJoinColumn: { name: 'id_especialidad' }
  })
  especialidades: Relation<Especialidad[]>;

  @Column({ type: 'varchar', length: 50, array: true, default: () => "'{}'" })
  etiquetas: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  creado: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modificado: Date;
}