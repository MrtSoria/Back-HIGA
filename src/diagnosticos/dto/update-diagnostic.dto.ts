import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  IsArray,
  ArrayMaxSize
} from 'class-validator';

export class UpdateDiagnosticoDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Matches(/\S/)
  titulo?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  desc?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  etiquetas?: string[]
}