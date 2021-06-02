import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { PatientService } from '../patient/patient.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Patient } from 'src/patient/entitites/patient.entity';
import { CreatePatientDto } from 'src/patient/dto/patient.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly patientService: PatientService) {}

  //creates doctor entity from DTO
  async create(
    createDoctorDto: CreateDoctorDto,
    patients?: Patient[],
  ): Promise<Doctor> {
    const doctor = new Doctor();
    doctor.id = createDoctorDto.id;
    doctor.department = createDoctorDto.department;
    doctor.patients = patients ? patients : null;
    return doctor;
  }

  //finds one doctor within transaction
  async findOne(
    queryRunner: QueryRunner,
    id: string,
    skipError = true,
  ): Promise<Doctor> {
    const doctor = await queryRunner.manager.findOne(Doctor, id, {
      relations: ['patients', 'patients.diseases'],
    });

    if (!doctor && !skipError) {
      throw new NotFoundException(`Doctor with id: ${id} not found`);
    }

    return doctor;
  }

  //returns all doctors within transaction
  async findAll(
    queryRunner: QueryRunner,
    paginationQuery: PaginationQueryDto,
  ): Promise<Doctor[]> {
    const { limit, offset } = paginationQuery;

    return await queryRunner.manager.find(Doctor, {
      relations: ['patients', 'patients.diseases'],
      skip: limit,
      take: offset,
    });
  }

  //accepts single doctor data, which can include patient & disease data & stores it in db within a transaction
  async save(
    queryRunner: QueryRunner,
    createDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    const patients = createDoctorDto.patients
      ? await this.preloadPatientsLoop(createDoctorDto.patients, queryRunner)
      : null;

    //creates a patient & saves it with diseases
    const doctor = await this.create(createDoctorDto, patients);
    return await queryRunner.manager.save(doctor);
  }

  //updates doctor data & cascades down to patient & disease data. If patient isnt added to doctor object when updating, it nulls the doctor_id of unincluded patient
  async update(
    queryRunner: QueryRunner,
    id: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    await this.findOne(queryRunner, id, false);

    const patients = updateDoctorDto.patients
      ? await this.preloadPatientsLoop(updateDoctorDto.patients, queryRunner)
      : null;

    const doctor = await queryRunner.manager.preload(Doctor, {
      id: id,
      ...updateDoctorDto,
      patients,
    });

    return await queryRunner.manager.save(doctor);
  }

  //deletes doctor & sets associated patients doctorId to null
  async remove(queryRunner: QueryRunner, id: string): Promise<Doctor> {
    const doctor = await this.findOne(queryRunner, id, false);
    return await queryRunner.manager.remove(doctor);
  }

  //checks if patient exists & returns it, creates one if not
  async preloadPatientsLoop(
    patients: CreatePatientDto[],
    queryRunner: QueryRunner,
  ): Promise<Patient[]> {
    return await Promise.all(
      patients.map((patient) => {
        return this.patientService.preloadPatientById(patient, queryRunner);
      }),
    );
  }
}
