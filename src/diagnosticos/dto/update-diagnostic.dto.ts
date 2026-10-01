import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
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

}