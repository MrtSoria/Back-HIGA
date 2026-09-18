import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProtocoloDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    titulo: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    subtitulo: string;

    @IsString()
    @IsNotEmpty()
    desc: string;

}