import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateProtocoloDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @Matches(/\S/)
  subtitulo: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/\S/)
  desc: string;

  @IsNotEmpty()
  @IsNumberString()
  id_diagnostico: string;
}