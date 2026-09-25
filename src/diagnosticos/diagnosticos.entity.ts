import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import type { Protocolo } from '../protocolos/protocolos.entity.js';

@Entity('diagnosticos')
export class Diagnostico {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  titulo: string;

  @Column({ type: 'text' })
  desc: string;

  @OneToOne('Protocolo',
    (protocolo: Protocolo) => protocolo.id_diagnostico)
  protocolo?: Protocolo;

  @CreateDateColumn()
  creado: Date;

  @UpdateDateColumn()
  modificado: Date;
}