import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { DiseaseService } from 'src/disease/disease.service';
import { Disease } from 'src/disease/entities/disease.entity';
import { QueryRunner } from 'typeorm';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { Patient } from './entitites/patient.entity';

@Injectable()
export class PatientService {
  constructor(private readonly diseaseService: DiseaseService) {}

  //creates disease entity from DTO
  async create(
    createPatientDto: CreatePatientDto,
    diseases?: Disease[],
  ): Promise<Patient> {
    const patient = new Patient();
    patient.id = createPatientDto.id;
    patient.first_name = createPatientDto.first_name;
    patient.last_name = createPatientDto.last_name;
    patient.diseases = diseases ? diseases : [];
    return patient;
  }

  //finds a patient by id by using a within a given transaction & returns patient with diseases
  async findOne(
    queryRunner: QueryRunner,
    id: string,
    skipError = true,
  ): Promise<Patient> {
    const patient = await queryRunner.manager.findOne(Patient, id, {
      relations: ['diseases'],
    });
    if (!patient && !skipError) {
      throw new NotFoundException(`Patient with id: ${id} not found`);
    }

    return patient;
  }

  //returns all patients within a transaction
  async findAll(
    queryRunner: QueryRunner,
    paginationQuery: PaginationQueryDto,
  ): Promise<Patient[]> {
    const { limit, offset } = paginationQuery;

    return await queryRunner.manager.find(Patient, {
      relations: ['diseases'],
      skip: offset,
      take: limit,
    });
  }

  //checks if a patient exists & returns that patient if it does, otherwise creates a new patient in db & returns a Promise
  async preloadPatientById(
    createPatientDto: CreatePatientDto,
    queryRunner: QueryRunner,
  ): Promise<Patient> {
    const patient = await this.findOne(queryRunner, createPatientDto.id);

    if (patient) {
      return await this.update(queryRunner, patient.id, {
        ...patient,
        diseases: createPatientDto.diseases,
      });
    }

    return await this.save(queryRunner, createPatientDto);
  }

  //saves a patient to db within a transaction
  async save(
    queryRunner: QueryRunner,
    createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    const diseases = createPatientDto.diseases
      ? await this.preloadDiseaseLoop(createPatientDto.diseases, queryRunner)
      : null;

    //creates a patient & saves it with diseases
    const patient = await this.create(createPatientDto, diseases);
    return await queryRunner.manager.save(patient);
  }

  //updates patient within transaction, diseases are overwritten with newly provided ones, if empty string provided, patient will have no diseases
  async update(
    queryRunner: QueryRunner,
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    await this.findOne(queryRunner, id, false);

    const diseases = updatePatientDto.diseases
      ? await this.preloadDiseaseLoop(updatePatientDto.diseases, queryRunner)
      : null;

    const patient = await queryRunner.manager.preload(Patient, {
      id: id,
      ...updatePatientDto,
      diseases,
    });

    return await queryRunner.manager.save(patient);
  }

  //removes patient from db within a transaction
  async remove(queryRunner: QueryRunner, id: string): Promise<Patient> {
    const patient = await this.findOne(queryRunner, id, false);

    return await queryRunner.manager.remove(patient);
  }

  //checks if disease exists & returns it, creates one if not
  async preloadDiseaseLoop(
    diseases: string[],
    queryRunner: QueryRunner,
  ): Promise<Disease[]> {
    return await Promise.all(
      diseases.map((disease) => {
        return this.diseaseService.preloadDiseaseByName(
          { name: disease },
          queryRunner,
        );
      }),
    );
  }
}
