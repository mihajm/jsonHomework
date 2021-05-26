import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiseaseService } from 'src/disease/disease.service';
import {
  CreateDiseaseDto,
  UpdateDiseaseDto,
} from 'src/disease/dto/disease.dto';
import { Repository } from 'typeorm';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { Patient } from './entitites/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly diseaseService: DiseaseService,
  ) {}

  //checks if a patient exists & returns that patient if it does, otherwise creates a new patient in db & returns a Promise
  async preloadPatientById(
    createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    //checks if patient alreadyexists & returns if so
    const patient = await this.patientRepository.findOne(createPatientDto.id);
    if (patient) return patient;

    const diseases = await Promise.all(
      createPatientDto.diseases?.map((diseaseName) => {
        const disease: CreateDiseaseDto = {
          name: diseaseName,
        };
        return this.diseaseService.preloadDiseaseByName(disease);
      }),
    );

    //creates a patient, with associated diseases
    return await this.patientRepository.create({
      ...createPatientDto,
      diseases,
    });
  }

  async findAll() {
    return await this.patientRepository.find({
      relations: ['diseases'],
    });
  }

  async findOne(id: string, skipError = false) {
    const patient = await this.patientRepository.findOne(id, {
      relations: ['diseases'],
    });
    if (!patient && !skipError)
      throw new NotFoundException(`Patient with id: ${id} not found`);
    return patient;
  }

  async create(createPatientDto: CreatePatientDto) {
    //checks if Patient exists & throws an exception if it finds one with the same id
    if (await this.patientRepository.findOne(createPatientDto.id)) {
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
          return this.diseaseService.preloadDiseaseByName(createDiseaseDto);
        }),
      ));

    //creates a patient, with associated diseases
    const doctor = await this.patientRepository.create({
      ...createPatientDto,
      diseases,
    });
    return await this.patientRepository.save(doctor);
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const diseases =
      updatePatientDto.diseases &&
      (await Promise.all(
        updatePatientDto.diseases?.map(async (disease) => {
          const diseaseId = await this.diseaseService.findOneByName(disease);
          if (diseaseId) {
            const updateDiseaseDto: UpdateDiseaseDto = {
              name: disease,
            };
            return this.diseaseService.update(diseaseId, updateDiseaseDto);
          } else {
            const createDiseaseDto: CreateDiseaseDto = {
              name: disease,
            };
            return await this.diseaseService.create(createDiseaseDto);
          }
        }),
      ));
    const patient = await this.patientRepository.preload({
      id: id,
      ...updatePatientDto,
      diseases,
    });

    if (!patient)
      throw new NotFoundException(`Patient with id: ${id} not found`);

    return await this.patientRepository.save(patient);
  }

  async remove(id: string) {
    const patient = await this.findOne(id);
    return await this.patientRepository.remove(patient);
  }
}
