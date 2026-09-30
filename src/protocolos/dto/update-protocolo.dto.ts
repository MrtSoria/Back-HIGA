import {
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
  @IsString()
  id_diagnostico?: string;
}