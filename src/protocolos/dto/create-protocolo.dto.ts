import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProtocoloDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  subtitulo: string;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsString()
  id_diagnostico: string;
}