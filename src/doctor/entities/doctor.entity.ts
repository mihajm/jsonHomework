import { Patient } from 'src/patient/entitites/patient.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('DOCTORS')
export class Doctor {
  @PrimaryColumn({ name: 'ID' })
  id: string;

  @Column({ name: 'DEPARTMENT' })
  department: string;

  @OneToMany(() => Patient, (patient) => patient.doctor, { cascade: true })
  patients: Patient[];
}
