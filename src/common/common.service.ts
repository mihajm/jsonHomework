import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Disease } from 'src/disease/entities/disease.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { loggedEvent } from 'src/event-logger/entities/logged-event.entity';
import { EventLogger } from 'src/event-logger/event-logger.service';
import { Patient } from 'src/patient/entitites/patient.entity';
import { Connection } from 'typeorm';
import {
  TransacactableObject,
  transactionCommand,
} from './interfaces/transacactable-object.interface';

@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => EventLogger))
    private readonly eventLogger: EventLogger,
    private connection: Connection,
  ) {
    this.eventLogger.setContext('Global');
  }
  async tryCatchWrapper(context: string, payload: string, wrappedFunction) {
    this.eventLogger.setContext(context);
    try {
      await this.eventLogger.storeLog({
        context: this.eventLogger['context'],
        payload,
      });
      return await wrappedFunction;
    } catch (err) {
      await this.eventLogger.storeLog({
        context: this.eventLogger['context'],
        payload,
        errorMsg: `Error ${err.response.statusCode}: ${err.response.message}`,
      });
      return `Error ${err.response.statusCode}: ${err.response.message}`;
    }
  }

  async transactionProvider(
    saveArray: TransacactableObject[],
    context?: string,
    payload?: string,
  ) {
    const log = new loggedEvent();
    log.context = context ? context : this.eventLogger['context'];
    log.payload = payload ? payload : null;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    let returnData;

    try {
      //loops through an array of objects & commands, creating each in order.
      let loopData;
      returnData = await Promise.all(
        saveArray.map(async (item) => {
          //checks which command to create
          switch (item.command) {
            case 0: //saveEnum
              return await queryRunner.manager.save(item.object, {
                transaction: false,
              });
              break;
            case 1: //updateEnum
              //check if necessary adta has been provided
              if (!item.objectId)
                throw new BadRequestException(
                  'Error, id must be provided to update an object',
                );

              //queries the database and returns the object that needs updating, fails if none found
              const saveObject: Disease | Patient | Doctor =
                await queryRunner.manager.findOneOrFail(
                  Disease,
                  item.objectId,
                  { transaction: false },
                );

              //loops through each property (except ID) & updates it with a new one
              for (const property in saveObject) {
                if (property === 'ID') continue;
                saveObject[property] = item.object[property];
              }

              //saves the updated object in the database
              return await queryRunner.manager.save(saveObject, {
                transaction: false,
              });
              break;
            case 2: //removeEnum
              return await queryRunner.manager.remove(item.object, {
                transaction: false,
              });
              break;
          }
        }),
      );

      await queryRunner.manager.save(log);
      await queryRunner.commitTransaction();
      return returnData;
    } catch (err) {
      console.log(err);
      log.errorMsg = `Error ${err.response.statusCode}: ${err.response.message}`;
      await this.eventLogger.storeLog(log);
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async provideQr(context: string, payload: string) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();

    const log = new loggedEvent();
    log.context = context ? context : this.eventLogger['context'];
    log.payload = payload ? payload : null;

    return { queryRunner, log };
  }
}
