import { forwardRef, Module } from '@nestjs/common';
import { DiseaseModule } from 'src/disease/disease.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { EventLoggerModule } from 'src/event-logger/event-logger.module';
import { PatientModule } from 'src/patient/patient.module';
import { CommonService } from './common.service';

@Module({
  imports: [
    forwardRef(() => PatientModule),
    forwardRef(() => DoctorModule),
    forwardRef(() => DiseaseModule),
    forwardRef(() => EventLoggerModule),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
