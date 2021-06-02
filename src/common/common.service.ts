import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { loggedEvent } from 'src/event-logger/entities/logged-event.entity';
import { EventLogger } from 'src/event-logger/event-logger.service';
import { Connection, QueryRunner } from 'typeorm';
import { TransactionQRAndLog } from './types/transaction-qr-and-log.type';

@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => EventLogger))
    private readonly eventLogger: EventLogger,
    private connection: Connection,
  ) {
    this.eventLogger.setContext('Global');
  }
  async tryCatchWrapper(
    wrappedFunction,
    queryRunner: QueryRunner,
    log: loggedEvent,
  ): Promise<any> {
    await queryRunner.startTransaction();
    let returnData;
    try {
      returnData = await wrappedFunction;
    } catch (err) {
      log.errorMsg = await this.transactionError(queryRunner, err);
      returnData = err;
    } finally {
      await this.transactionFinish(queryRunner, log);
      return returnData;
    }
  }

  async provideQr(
    context: string,
    payload: string,
  ): Promise<TransactionQRAndLog> {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();

    const log = new loggedEvent();
    log.context = context ? context : this.eventLogger['context'];
    log.payload = payload ? payload : null;

    return { queryRunner, log };
  }

  //rollsback the transaction and returns the log for storage & error message for the return object
  async transactionError(queryRunner: QueryRunner, err): Promise<string> {
    queryRunner.rollbackTransaction();
    return `Error ${err.response.statusCode}: ${err.response.message}`;
  }

  //stores log & finishes transaction
  async transactionFinish(
    queryRunner: QueryRunner,
    log: loggedEvent,
  ): Promise<void> {
    await queryRunner.manager.save(log);
    queryRunner.release();
  }
}
