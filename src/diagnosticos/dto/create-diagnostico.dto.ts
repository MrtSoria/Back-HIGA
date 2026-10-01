import {
  IsNotEmpty,
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

}