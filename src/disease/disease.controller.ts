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
    return this.diseaseService.save(createDiseaseDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiseaseDto: UpdateDiseaseDto) {
    return this.diseaseService.update(id, updateDiseaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diseaseService.remove(id);
  }
}
