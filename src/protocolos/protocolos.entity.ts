import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import type { Diagnostico } from '../diagnosticos/diagnosticos.entity.js';

@Entity('protocolos')
export class Protocolo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  titulo: string;

  @Column({ length: 150 })
  subtitulo: string;

  @Column({ type: 'text' })
  desc: string;

  @OneToOne('Diagnostico',
    (diagnostico: Diagnostico) => diagnostico.protocolo,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'diagnosticoId'
  })
  diagnosticoId: Diagnostico;

  @CreateDateColumn()
  creado: Date;

  @UpdateDateColumn()
  modificado: Date;
}