import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  IsArray,
  IsBoolean,
  IsNumberString
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/\S/)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/\S/)
  apellido?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  especialidades?: string[];

  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;
}