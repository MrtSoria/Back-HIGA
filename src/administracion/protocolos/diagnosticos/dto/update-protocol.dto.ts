import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateDiagnosticoDto {
    @IsOptional()
    @IsString()
    @MaxLength(150)
    titulo?: string;
  
    @IsOptional()
    @IsString()
    desc?: string;
  
}