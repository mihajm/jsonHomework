import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { PatientService } from '../patient/patient.service';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly patientService: PatientService,
  ) {}

  //returns all data
  async findAll() {
    return await this.doctorRepository.find({
      relations: ['patients', 'patients.diseases'],
    });
  }

  async findOne(id: string, skipError = false) {
    const doctor = await this.doctorRepository.findOne(id, {
      relations: ['patients', 'patients.diseases'],
    });
    if (!doctor && !skipError)
      throw new NotFoundException(`Doctor with id: ${id} not found`);
    return doctor;
  }

  //accepts single doctor data, which can include patient & disease data & stores it in db.
  async create(createDoctorDto: CreateDoctorDto) {
    //checks if doctor exists & throws an exception if it finds one with the same id
    if (await this.doctorRepository.findOne(createDoctorDto.id)) {
      throw new BadRequestException(
        `Doctor with id: ${createDoctorDto.id} already exists, did you mean to update the data?`,
      );
    }

    //creates an array of all patients relevant to the doctor object we're creating, both stored in db & new ones
    const patients =
      createDoctorDto.patients &&
      (await Promise.all(
        createDoctorDto.patients?.map((patient) => {
          return this.patientService.preloadPatientById(patient);
        }),
      ));

    //creates a patient, with associated diseases
    const doctor = await this.doctorRepository.create({
      ...createDoctorDto,
      patients,
    });
    return await this.doctorRepository.save(doctor);
  }

  //updates doctor data & cascades down to patient & disease data. If patient isnt added to doctor object when updating, it nulls the doctor_id of unincluded patient
  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
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

  //deletes doctor & all associated patients
  async remove(id: string) {
    const doctor = await this.findOne(id);

    //option to remove all related patients when deleting a doctor
    /*
    await Promise.all(
      doctor.patients.map((patient) => {
        this.patientService.remove(patient.id);
      }),
    );*/

    //removes all patients from doctor but keeps them in db with null as their doctor
    await this.update(doctor.id, {
      department: doctor.department,
      patients: [],
    });

    return await this.doctorRepository.remove(doctor);
  }
}
