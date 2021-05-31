import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { In, QueryRunner, Repository } from 'typeorm';
import { CreateDiseaseDto, UpdateDiseaseDto } from './dto/disease.dto';
import { Disease } from './entities/disease.entity';

@Injectable()
export class DiseaseService {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    private readonly commonService: CommonService,
  ) {}

  //checks if a patient exists & returns that patient if it does, otherwise creates a new patient in db & returns a Promise
  async preloadDiseaseByName(
    createDiseaseDto: CreateDiseaseDto,
    queryRunner: QueryRunner,
  ): Promise<Disease> {
    let disease = await queryRunner.manager.findOne(Disease, {
      name: createDiseaseDto.name,
    });
    if (disease) return disease;
    disease = await this.create(createDiseaseDto);
    return await queryRunner.manager.save(disease);
  }

  async findManyByName(diseases: string[]) {
    return await this.diseaseRepository.find({
      name: In([...diseases]),
    });
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
    const disease = new Disease();
    disease.name = createDiseaseDto.name;
    return disease;
  }

  async save(createDiseaseDto: CreateDiseaseDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'createDisease',
      JSON.stringify(createDiseaseDto),
    );

    await queryRunner.startTransaction();
    let returnData;

    try {
      //checks if disease exists & throws an exception if it finds one with the same id
      if (
        await queryRunner.manager.findOne(Disease, {
          name: createDiseaseDto.name,
        })
      )
        throw new BadRequestException(
          `Disease: ${createDiseaseDto.name} already exists!`,
        );

      //creates a disease & saves it
      const disease = await this.create(createDiseaseDto);
      returnData = await queryRunner.manager.save(disease);

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

  async update(id: string, updateDiseaseDto: UpdateDiseaseDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'updateDisease',
      `'id': ${id}, json: ${JSON.stringify(updateDiseaseDto)}`,
    );

    await queryRunner.startTransaction();
    let returnData;

    try {
      if (!(await queryRunner.manager.findOne(id)))
        throw new NotFoundException(
          `Couldn't find Disease with id: ${id}, are you sure it exists?`,
        );

      const disease = await queryRunner.manager.preload(Disease, {
        ID: +id,
        ...updateDiseaseDto,
      });

      returnData = await queryRunner.manager.save(disease);
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
      'deleteDisease',
      `'id': ${id}`,
    );

    await queryRunner.startTransaction();
    let returnData;

    try {
      const disease = await queryRunner.manager.findOne(Disease, { ID: +id });
      if (!disease)
        throw new NotFoundException(
          `Couldn't find Disease with id: ${id}, are you sure it exists?`,
        );
      returnData = await queryRunner.manager.remove(disease);
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
