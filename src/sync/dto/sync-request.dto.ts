import { IsNumberString } from "class-validator";

export class SyncRequestDto {
    // id_usuario
    @IsNumberString()
    id: string;

    // nro_sync
    @IsNumberString()
    sync: string;
}