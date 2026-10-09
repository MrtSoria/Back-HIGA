import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Protocolo } from '../protocolos/protocolos.entity.js';

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

  @Column({ type: 'varchar', length: 50, array: true, default: () => "'{}'" })
  etiquetas: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  creado: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modificado: Date;
}