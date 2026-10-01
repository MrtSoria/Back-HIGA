import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateProtocoloDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  subtitulo?: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsNumberString()
  id_diagnostico?: string;
}