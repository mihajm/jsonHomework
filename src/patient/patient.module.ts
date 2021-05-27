import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entitites/patient.entity';
import { DiseaseModule } from 'src/disease/disease.module';
import { EventLoggerModule } from 'src/event-logger/event-logger.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    DiseaseModule,
    EventLoggerModule,
    TypeOrmModule.forFeature([Patient]),
    CommonModule,
  ],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}
