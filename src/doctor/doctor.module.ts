import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { PatientModule } from 'src/patient/patient.module';
import { DiseaseModule } from 'src/disease/disease.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Patient } from 'src/patient/entitites/patient.entity';
import { Disease } from 'src/disease/entities/disease.entity';

@Module({
  imports: [
    PatientModule,
    DiseaseModule,
    TypeOrmModule.forFeature([Doctor, Patient, Disease]),
  ],
  providers: [DoctorService],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export class DoctorModule {}
