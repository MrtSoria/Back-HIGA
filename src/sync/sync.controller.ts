import { Controller, Get, Param, Query } from '@nestjs/common';
import { SyncService } from './sync.service.js';
import { SyncRequestDto } from './dto/sync-request.dto.js';

@Controller('sync')
export class SyncController {
    constructor(
        private readonly service: SyncService
    ) { }

    @Get()
    async sincronizar(
        @Query() dto: SyncRequestDto
    ) {
        return this.service.sincronizar(dto);
    }
}
