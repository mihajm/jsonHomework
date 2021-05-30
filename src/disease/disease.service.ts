import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateDiseaseDto, UpdateDiseaseDto } from './dto/disease.dto';
import { Disease } from './entities/disease.entity';

@Injectable()
export class DiseaseService {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
  ) {}

  //checks if a patient exists & returns that patient if it does, otherwise creates a new patient in db & returns a Promise
  async preloadDiseaseByName(
    createDiseaseDto: CreateDiseaseDto,
  ): Promise<Disease> {
    const disease = await this.diseaseRepository.findOne({
      name: createDiseaseDto.name,
    });
    if (disease) return disease;
    return await this.diseaseRepository.create(createDiseaseDto);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    const diseases = await this.diseaseRepository.find({
      relations: [],
      skip: offset,
      take: limit,
    });
    if (
      !diseases.every((disease) => {
        return disease instanceof Disease;
      })
    ) {
      throw new InternalServerErrorException(
        'Database error, misshappen data returned.',
      );
    }
    return diseases;
  }

  async findOne(id: string, skipError = false) {
    const disease = await this.diseaseRepository.findOne(id);
    if (!disease && !skipError) {
      throw new NotFoundException(`Disease with id: ${id} not found`);
    }
    if (disease instanceof Disease === false) {
      throw new InternalServerErrorException(
        'Database error, misshappen data returned.',
      );
    }
    return disease;
  }

  async findOneByName(name: string) {
    const disease = await this.diseaseRepository.findOne({ name: name });
    if (!disease) throw new NotFoundException(`${name} not found`);
    return disease.ID.toString();
  }

  async create(createDiseaseDto: CreateDiseaseDto) {
    //checks if disease exists & throws an exception if it finds one with the same id
    if (await this.diseaseRepository.findOne({ name: createDiseaseDto.name })) {
      throw new BadRequestException(
        `Disease: ${createDiseaseDto.name} already exists, did you mean to update the data?`,
      );
    }

    //creates a disease, with associated diseases
    const doctor = await this.diseaseRepository.create(createDiseaseDto);
    return await this.diseaseRepository.save(doctor);
  }

  async update(id: string, updateDiseaseDto: UpdateDiseaseDto) {
    const disease = await this.diseaseRepository.preload({
      ID: +id,
      ...updateDiseaseDto,
    });

    if (!disease)
      throw new NotFoundException(`Disease with id: ${id} not found`);

    return await this.diseaseRepository.save(disease);
  }

  async remove(id: string) {
    const disease = await this.findOne(id);
    return await this.diseaseRepository.remove(disease);
  }
}
