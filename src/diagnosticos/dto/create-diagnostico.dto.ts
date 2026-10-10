import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateDiagnosticoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @Matches(/\S/)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  desc: string;

  @IsArray()
  @IsNumberString({}, { each: true })
  especialidades: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  etiquetas?: string[]
}