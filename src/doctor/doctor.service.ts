import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { PatientService } from '../patient/patient.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CommonService } from 'src/common/common.service';
import { transactionCommand } from '../common/interfaces/transacactable-object.interface';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly patientService: PatientService,
    private readonly commonService: CommonService,
  ) {}

  //returns all data
  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    const doctors = await this.doctorRepository.find({
      relations: ['patients', 'patients.diseases'],
      skip: offset,
      take: limit,
    });

    if (
      !doctors.every((doctor) => {
        return doctor instanceof Doctor;
      })
    ) {
      throw new InternalServerErrorException(
        'Database error, misshappen data returned.',
      );
    }

    return doctors;
  }

  async findOne(id: string, skipError = false) {
    const doctor = await this.doctorRepository.findOne(id, {
      relations: ['patients', 'patients.diseases'],
    });

    if (!doctor && !skipError) {
      throw new NotFoundException(`Doctor with id: ${id} not found`);
    }

    if (doctor instanceof Doctor === false) {
      throw new InternalServerErrorException(
        'Database error, misshappen data returned.',
      );
    }

    return doctor;
  }

  //accepts single doctor data, which can include patient & disease data & stores it in db.
  async save(createDoctorDto: CreateDoctorDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'createDoctor',
      JSON.stringify(createDoctorDto),
    );

    await queryRunner.startTransaction();
    let returnData;

    try {
      //checks if doctor exists & throws an exception if it finds one with the same id
      if (
        await queryRunner.manager.findOne(Doctor, { id: createDoctorDto.id })
      ) {
        throw new BadRequestException(
          `Doctor with id: ${createDoctorDto.id} already exists, did you mean to update the data?`,
        );
      }

      //creates an array of all patients relevant to the doctor object we're creating, both stored in db & new ones
      const patients =
        createDoctorDto.patients &&
        (await Promise.all(
          createDoctorDto.patients?.map((patient) => {
            return this.patientService.preloadPatientById(patient, queryRunner);
          }),
        ));

      //creates a patient, with associated diseases
      const doctor = await queryRunner.manager.create(Doctor, {
        ...createDoctorDto,
        patients,
      });

      returnData = await queryRunner.manager.save(doctor);
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

  //updates doctor data & cascades down to patient & disease data. If patient isnt added to doctor object when updating, it nulls the doctor_id of unincluded patient
  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'updateDoctor',
      `'id': ${id}, json: ${JSON.stringify(updateDoctorDto)}`,
    );
    const patients =
      updateDoctorDto.patients &&
      (await Promise.all(
        updateDoctorDto.patients?.map(async (patient) => {
          if (await this.patientService.findOne(patient.id, true)) {
            return this.patientService.update(patient.id, patient);
          } else {
            return this.patientService.create(patient);
          }
        }),
      ));
    const doctor = await this.doctorRepository.preload({
      id: id,
      ...updateDoctorDto,
      patients,
    });

    if (!doctor) throw new NotFoundException(`Doctor with id: ${id} not found`);

    return await this.doctorRepository.save(doctor);
  }

  //deletes doctor & sets associated patients doctorId to null
  async remove(id: string) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'deleteDoctor',
      `id: ${id}`,
    );

    await queryRunner.startTransaction();
    let returnData;

    try {
      let doctor = await queryRunner.manager.findOne(
        Doctor,
        { id: id },
        {
          relations: ['patients', 'patients.diseases'],
        },
      );

      if (!doctor)
        throw new NotFoundException(
          `Error: Doctor with id: ${id} doesn't exist.`,
        );

      if (doctor.patients && doctor.patients.length > 0) {
        doctor.patients = [];
        doctor = await queryRunner.manager.preload(Doctor, {
          ...doctor,
        });
        doctor = await queryRunner.manager.save(doctor);
      }

      returnData = await queryRunner.manager.remove(doctor);
      queryRunner.commitTransaction();
    } catch (err) {
      //console.log(err);
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
