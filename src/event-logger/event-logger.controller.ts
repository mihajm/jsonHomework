import { Controller, Get } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { EventLogger } from './event-logger.service';

@Controller('event')
export class EventLoggerController {
  constructor(
    private readonly eventService: EventLogger,
    private readonly commonService: CommonService,
  ) {}
  @Get()
  findAll() {
    return this.commonService.tryCatchWrapper(
      'findAllEvents',
      null,
      this.eventService.findAll(),
    );
  }
}
