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
import { ApiTags } from '@nestjs/swagger';
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

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.commonService.tryCatchWrapper(
      'findAllDiseases',
      null,
      this.diseaseService.findAll(paginationQuery),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonService.tryCatchWrapper(
      'findDisese',
      `'id': ${id}`,
      this.diseaseService.findOne(id),
    );
  }

  @Post()
  create(@Body() createDiseaseDto: CreateDiseaseDto) {
    return this.commonService.tryCatchWrapper(
      'createDisease',
      JSON.stringify(createDiseaseDto),
      this.diseaseService.create(createDiseaseDto),
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiseaseDto: UpdateDiseaseDto) {
    return this.commonService.tryCatchWrapper(
      'updateDisease',
      `'id': ${id}, json: ${JSON.stringify(updateDiseaseDto)}`,
      this.diseaseService.update(id, updateDiseaseDto),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonService.tryCatchWrapper(
      'deleteDisease',
      `'id': ${id}`,
      this.diseaseService.remove(id),
    );
  }
}
