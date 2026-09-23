import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProtocoloDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  titulo: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  subtitulo: string;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsNumber()
  diagnosticoId: number;
}