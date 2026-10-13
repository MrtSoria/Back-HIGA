import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  IsNumberString,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/\S/)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/\S/)
  apellido: string;

  @IsArray()
  @IsNumberString({}, { each: true })
  especialidades: string[];

  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;
}