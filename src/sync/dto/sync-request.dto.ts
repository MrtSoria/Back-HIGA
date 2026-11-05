import { IsDateString, IsNumberString, IsOptional } from "class-validator";

export class SyncRequestDto {
    // id_usuario
    @IsNumberString()
    id: string;

    // nro_sync
    @IsNumberString()
    sync: string;

    // fecha de ultima sync
    @IsOptional()
    @IsDateString()
    last_sync_at?: string;
}