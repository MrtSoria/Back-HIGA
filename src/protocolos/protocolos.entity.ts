import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Diagnostico } from '../diagnosticos/diagnosticos.entity.js';

@Entity('protocolos')
export class Protocolo {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 150 })
  subtitulo: string;

  @Column({ type: 'text' })
  desc: string;

  @OneToOne(() => Diagnostico,
    { onDelete: 'RESTRICT' }
  )
  @JoinColumn({ name: 'id_diagnostico' })
  diagnostico: Relation<Diagnostico>;

  @CreateDateColumn({ type: 'timestamptz' })
  creado: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modificado: Date;
}