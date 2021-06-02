import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { EventLogger } from './event-logger.service';

@Controller('event')
export class EventLoggerController {
  constructor(
    private readonly eventService: EventLogger,
    private readonly commonService: CommonService,
  ) {}

  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'findAllEvents',
      null,
    );
    return await this.commonService.tryCatchWrapper(
      await this.eventService.findAll(queryRunner, paginationQuery),
      queryRunner,
      log,
    );
  }
}
