import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDiagnosticoDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    titulo: string;

    @IsString()
    @IsNotEmpty()
    desc: string;

}