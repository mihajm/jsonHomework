import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { transactionCommand } from 'src/common/interfaces/transacactable-object.interface';
import { DiseaseService } from 'src/disease/disease.service';
import {
  CreateDiseaseDto,
  UpdateDiseaseDto,
} from 'src/disease/dto/disease.dto';
import { Disease } from 'src/disease/entities/disease.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { Patient } from './entitites/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    private readonly diseaseService: DiseaseService,
    private readonly commonService: CommonService,
  ) {}

  //checks if a patient exists & returns that patient if it does, otherwise creates a new patient in db & returns a Promise
  async preloadPatientById(
    createPatientDto: CreatePatientDto,
    queryRunner: QueryRunner,
  ): Promise<Patient> {
    //checks if patient alreadyexists & returns if so
    const patient = await queryRunner.manager.findOne(Patient, {
      id: createPatientDto.id,
    });
    if (patient) return patient;

    const diseases = await Promise.all(
      createPatientDto.diseases?.map((diseaseName) => {
        const disease: CreateDiseaseDto = {
          name: diseaseName,
        };
        return this.diseaseService.preloadDiseaseByName(disease, queryRunner);
      }),
    );

    //creates a patient, with associated diseases
    return await this.patientRepository.create({
      ...createPatientDto,
      diseases,
    });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    const patients = await this.patientRepository.find({
      relations: ['diseases'],
      skip: offset,
      take: limit,
    });

    if (
      !patients.every((patient) => {
        return patient instanceof Patient;
      })
    ) {
      throw new InternalServerErrorException(
        'Database error, misshappen data returned.',
      );
    }

    return patients;
  }

  async findOne(id: string, skipError = false) {
    const patient = await this.patientRepository.findOne(id, {
      relations: ['diseases'],
    });
    if (!patient && !skipError) {
      throw new NotFoundException(`Patient with id: ${id} not found`);
    }

    if (patient instanceof Patient === false) {
      throw new InternalServerErrorException(
        'Database error, misshappen data returned.',
      );
    }

    return patient;
  }

  async create(createPatientDto: CreatePatientDto, diseases?: Disease[]) {
    const patient = new Patient();
    patient.id = createPatientDto.id;
    patient.first_name = createPatientDto.first_name;
    patient.last_name = createPatientDto.last_name;
    patient.diseases = diseases && diseases;
    return patient;
  }

  async save(createPatientDto: CreatePatientDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'createPatient',
      `id: ${createPatientDto.id}, payload: ${JSON.stringify(
        createPatientDto,
      )} `,
    );

    await queryRunner.startTransaction();
    let returnData;

    try {
      //checks if Patient exists & throws an exception if it finds one with the same id
      if (
        await queryRunner.manager.findOne(Patient, { id: createPatientDto.id })
      ) {
        throw new BadRequestException(
          `Patient with id: ${createPatientDto.id} already exists, did you mean to update the data?`,
        );
      }

      //creates an array of all diseases relevant to the patient object we're creating, both stored in db & new ones
      const diseases =
        createPatientDto.diseases &&
        (await Promise.all(
          createPatientDto.diseases?.map((disease) => {
            const createDiseaseDto: CreateDiseaseDto = {
              name: disease,
            };
            return this.diseaseService.preloadDiseaseByName(
              createDiseaseDto,
              queryRunner,
            );
          }),
        ));

      //creates a patient, with associated diseases
      const patient = await queryRunner.manager.create(Patient, {
        ...createPatientDto,
        diseases,
      });

      returnData = await queryRunner.manager.save(patient);
      queryRunner.commitTransaction();
    } catch (err) {
      queryRunner.rollbackTransaction();
      returnData = err.response;
      log.errorMsg = `Error ${err.response.statusCode}: ${err.response.message}`;
    } finally {
      //stores log
      await queryRunner.manager.save(log);

      queryRunner.release();

      return returnData;
    }
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'removePatient',
      `id: ${id}`,
    );

    await queryRunner.startTransaction();
    let returnData;
    try {
      //create DiseaseList from existing & new ones
      const diseases =
        updatePatientDto.diseases &&
        (await Promise.all(
          updatePatientDto.diseases?.map(async (disease) => {
            //if disease exists return that disease
            const foundDisease = await queryRunner.manager.findOne(Disease, {
              name: disease,
            });
            if (foundDisease) return foundDisease;

            //if disease doesnt exist it creates one
            const newDisease = await this.diseaseService.create({
              name: disease,
            });
            return await queryRunner.manager.save(newDisease);
          }),
        ));

      const patient = await queryRunner.manager.preload(Patient, {
        id: id,
        ...updatePatientDto,
        diseases,
      });

      returnData = await queryRunner.manager.save(patient);
      queryRunner.commitTransaction();
    } catch (err) {
      queryRunner.rollbackTransaction();
      returnData = err.response;
      log.errorMsg = `Error ${err.response.statusCode}: ${err.response.message}`;
    } finally {
      //stores log
      await queryRunner.manager.save(log);

      queryRunner.release();
      return returnData;
    }
  }

  async remove(id: string) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'removePatient',
      `id: ${id}`,
    );

    await queryRunner.startTransaction();
    let returnData;

    try {
      const patient = await queryRunner.manager.findOne(Patient, { id: id });
      if (!patient)
        throw new NotFoundException(
          `Couldn't find Patient with id: ${id}, are you sure it exists?`,
        );
      returnData = await queryRunner.manager.remove(patient);
      await queryRunner.commitTransaction();
    } catch (err) {
      queryRunner.rollbackTransaction();
      returnData = err.response;
      log.errorMsg = `Error ${err.response.statusCode}: ${err.response.message}`;
    } finally {
      //stores log
      await queryRunner.manager.save(log);

      queryRunner.release();

      return returnData;
    }
  }
}
