import { Patient } from 'src/patient/entitites/patient.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('DISEASES')
@Index(['ID', 'name'])
export class Disease {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ name: 'NAME' })
  name: string;

  @ManyToMany((type) => Patient, (patients) => patients.diseases)
  patient: Patient[];
}
