import {
  IsOptional,
  IsString,
  Matches,
  MaxLength
} from 'class-validator';

export class UpdateEspecialidadDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/\S/)
  nombre?: string;
}