import { Injectable, Logger, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoggedEventDto } from './dto/logged-event.dto';
import { loggedEvent } from './entities/logged-event.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class EventLogger extends Logger {
  constructor(
    @InjectRepository(loggedEvent)
    private readonly eventRepository: Repository<loggedEvent>,
  ) {
    super();
  }
  async storeLog(createLoggedEventDto: CreateLoggedEventDto) {
    const log = await this.eventRepository.create(createLoggedEventDto);
    return await this.eventRepository.save(log);
  }
  error(message: string, trace: string, context?: string) {
    const createLoggedEventDto: CreateLoggedEventDto = {
      context: context,
      errorMsg: message,
    };
    this.storeLog(createLoggedEventDto);
    super.error(message, trace);
  }
  async findAll() {
    return await this.eventRepository.find();
  }
}
