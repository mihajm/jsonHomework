import { Injectable, Logger, Scope } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { QueryRunner } from 'typeorm';
import { loggedEvent } from './entities/logged-event.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class EventLogger extends Logger {
  constructor() {
    super();
  }
  async findAll(
    queryRunner: QueryRunner,
    paginationQuery: PaginationQueryDto,
  ): Promise<loggedEvent[]> {
    const { limit, offset } = paginationQuery;
    return await queryRunner.manager.find(loggedEvent, {
      skip: offset,
      take: limit,
    });
  }
}
