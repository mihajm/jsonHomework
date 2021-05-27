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
    return this.commonService.tryCatchWrapper(
      'createPatient',
      JSON.stringify(createPatientDto),
      this.patientService.create(createPatientDto),
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.commonService.tryCatchWrapper(
      'updatePatient',
      `'id': ${id}, json: ${JSON.stringify(updatePatientDto)}`,
      this.patientService.update(id, updatePatientDto),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonService.tryCatchWrapper(
      'removePatient',
      `'id': ${id}`,
      this.patientService.remove(id),
    );
  }
}
