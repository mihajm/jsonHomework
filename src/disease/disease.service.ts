import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { QueryRunner } from 'typeorm';
import { CreateDiseaseDto, UpdateDiseaseDto } from './dto/disease.dto';
import { Disease } from './entities/disease.entity';

@Injectable()
export class DiseaseService {
  async create(createDiseaseDto: CreateDiseaseDto): Promise<Disease> {
    const disease = new Disease();
    disease.name = createDiseaseDto.name;
    return disease;
  }

  //finds a disease by id by using a within a given transaction
  async findOne(
    queryRunner: QueryRunner,
    id: string,
    skipError = true,
  ): Promise<Disease> {
    const disease = await queryRunner.manager.findOne(Disease, id);
    if (!disease && !skipError) {
      throw new NotFoundException(`Disease with id: ${id} not found`);
    }
    return disease;
  }

  //finds a disease by name by using a within a given transaction
  async findOneByName(
    queryRunner: QueryRunner,
    name: string,
    skipError = true,
  ): Promise<Disease | undefined> {
    const disease = await queryRunner.manager.findOne(Disease, {
      name,
    });
    if (!disease && !skipError) {
      throw new NotFoundException(`Disease with name: ${name} not found`);
    }
    return disease;
  }

  //returns all diseases within a transaction
  async findAll(
    queryRunner: QueryRunner,
    paginationQuery: PaginationQueryDto,
  ): Promise<Disease[]> {
    const { limit, offset } = paginationQuery;

    return await queryRunner.manager.find(Disease, {
      relations: [],
      skip: offset,
      take: limit,
    });
  }

  //saves a disease to db within a transaction
  async save(
    queryRunner: QueryRunner,
    createDiseaseDto: CreateDiseaseDto,
  ): Promise<Disease> {
    //checks if disease exists & throws an exception if it finds one with the same id

    if (await this.findOneByName(queryRunner, createDiseaseDto.name)) {
      throw new BadRequestException(
        `Disease: ${createDiseaseDto.name} already exists!`,
      );
    }

    //creates a disease & saves it
    const disease = await this.create(createDiseaseDto);
    return await queryRunner.manager.save(disease);
  }

  async update(
    queryRunner: QueryRunner,
    id: string,
    updateDiseaseDto: UpdateDiseaseDto,
  ): Promise<Disease> {
    await this.findOne(queryRunner, id, false);

    const disease = await queryRunner.manager.preload(Disease, {
      ID: +id,
      ...updateDiseaseDto,
    });

    return await queryRunner.manager.save(disease);
  }

  //removes a disease from db within a transaction
  async remove(queryRunner: QueryRunner, id: string): Promise<Disease> {
    const disease = await await this.findOne(queryRunner, id, false);

    return await queryRunner.manager.remove(disease);
  }

  //checks if a patient exists & returns that patient if it does, otherwise creates a new patient in db & returns a Promise
  async preloadDiseaseByName(
    createDiseaseDto: CreateDiseaseDto,
    queryRunner: QueryRunner,
  ): Promise<Disease> {
    let disease = await this.findOneByName(queryRunner, createDiseaseDto.name);
    if (disease) return disease;
    disease = await this.create(createDiseaseDto);
    return await queryRunner.manager.save(disease);
  }
}
