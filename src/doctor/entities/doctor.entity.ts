import { Patient } from 'src/patient/entitites/patient.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('DOCTORS')
export class Doctor {
  @Index('DOCTOR_ID_INDEX')
  @PrimaryColumn({ name: 'ID' })
  id: string;

  @Column({ name: 'DEPARTMENT' })
  department: string;

  @ManyToMany((type) => Patient, (patients) => patients.doctors, {
    cascade: true,
  })
  @JoinTable({
    name: 'DOCTOR_PATIENT',
    joinColumn: { name: 'DOCTOR_ID', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'PATIENT_ID', referencedColumnName: 'id' },
  })
  patients: Patient[];
}
