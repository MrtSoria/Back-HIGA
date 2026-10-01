import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Entidad, Operacion } from '../historial/historial.enums.js';

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
}