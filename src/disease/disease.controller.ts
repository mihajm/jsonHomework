import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { DiseaseService } from './disease.service';
import { CreateDiseaseDto, UpdateDiseaseDto } from './dto/disease.dto';

@ApiTags('disease')
@Controller('disease')
export class DiseaseController {
  constructor(
    private readonly diseaseService: DiseaseService,
    private readonly commonService: CommonService,
  ) {}

  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'findAllDiseases',
      null,
    );

    return await this.commonService.tryCatchWrapper(
      await this.diseaseService.findAll(queryRunner, paginationQuery),
      queryRunner,
      log,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'findOneDisease',
      `id: ${id}`,
    );

    return await this.commonService.tryCatchWrapper(
      await this.diseaseService.findOne(queryRunner, id, false),
      queryRunner,
      log,
    );
  }

  @Post()
  async create(@Body() createDiseaseDto: CreateDiseaseDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'saveDisease',
      JSON.stringify(createDiseaseDto),
    );

    return await this.commonService.tryCatchWrapper(
      await this.diseaseService.save(queryRunner, createDiseaseDto),
      queryRunner,
      log,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiseaseDto: UpdateDiseaseDto,
  ) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'updateDisease',
      `id: ${id}, payload: ${JSON.stringify(updateDiseaseDto)}`,
    );

    return await this.commonService.tryCatchWrapper(
      await this.diseaseService.update(queryRunner, id, updateDiseaseDto),
      queryRunner,
      log,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'removeDisease',
      `id: ${id}`,
    );

    return await this.commonService.tryCatchWrapper(
      await this.diseaseService.remove(queryRunner, id),
      queryRunner,
      log,
    );
  }
}
