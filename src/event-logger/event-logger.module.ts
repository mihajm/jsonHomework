import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loggedEvent } from './entities/logged-event.entity';
import { EventLogger } from './event-logger.service';
import { EventLoggerController } from './event-logger.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    TypeOrmModule.forFeature([loggedEvent]),
  ],
  providers: [EventLogger],
  exports: [EventLogger],
  controllers: [EventLoggerController],
})
export class EventLoggerModule {}
