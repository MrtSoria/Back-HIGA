import { PartialType } from '@nestjs/mapped-types';
import { CreateProtocoloDto } from './create-protocolo.dto.js';

export class UpdateProtocoloDto extends PartialType(
  CreateProtocoloDto,
) {}