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
import { ApiQuery } from '@nestjs/swagger';
import { CommonService } from 'src/common/common.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { PatientService } from './patient.service';

@Controller('patient')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly commonService: CommonService,
  ) {}

  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.commonService.tryCatchWrapper(
      'findAllPatients',
      null,
      this.patientService.findAll(paginationQuery),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonService.tryCatchWrapper(
      'findOnePatient',
      `'id': ${id}`,
      this.patientService.findOne(id),
    );
  }

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.save(createPatientDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }
}
