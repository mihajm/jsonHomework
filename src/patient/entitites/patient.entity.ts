import { ApiProperty } from '@nestjs/swagger';
import { Disease } from 'src/disease/entities/disease.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('PATIENTS')
export class Patient {
  @Index('PATIENT-ID-INDEX')
  @PrimaryColumn({ name: 'ID' })
  id: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.patients)
  @JoinColumn({ name: 'DOCTOR_ID' })
  doctor: Doctor;

  @Column({ name: 'FIRST_NAME' })
  first_name: string;

  @Column({ name: 'LAST_NAME' })
  last_name: string;

  @ManyToMany((type) => Disease, (diseases) => diseases.patient, {
    cascade: true,
  })
  @JoinTable({
    name: 'PATIENT_DISEASE',
    joinColumn: { name: 'PATIENT_ID', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'DISEASE_ID', referencedColumnName: 'ID' },
  })
  diseases: Disease[];
}
