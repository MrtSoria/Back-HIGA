import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('protocolos') 
export class Protocolo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 150})
    titulo: string;

    @Column({length: 150})
    subtitulo: string;

    @Column({type: 'text'})
    desc: string;

    //agregar join con diagnóstico

    //agregar manejo de imagenes

    @CreateDateColumn()
    creado: Date;

    @UpdateDateColumn()
    modificado: Date;
}