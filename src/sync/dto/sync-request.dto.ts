import { IsNumberString } from "class-validator";

export class SyncRequestDto {
    @IsNumberString()
    id_usuario: string;

    @IsNumberString()
    last_sync: string;
}