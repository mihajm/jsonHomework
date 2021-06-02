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
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'findAllPatients',
      null,
    );
    return await this.commonService.tryCatchWrapper(
      await this.patientService.findAll(queryRunner, paginationQuery),
      queryRunner,
      log,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'findOnePatient',
      `id: ${id}`,
    );
    return await this.commonService.tryCatchWrapper(
      await this.patientService.findOne(queryRunner, id, false),
      queryRunner,
      log,
    );
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'savePatient',
      JSON.stringify(createPatientDto),
    );
    return await this.commonService.tryCatchWrapper(
      await this.patientService.save(queryRunner, createPatientDto),
      queryRunner,
      log,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'updatePatient',
      `id: ${id}, payload: ${JSON.stringify(updatePatientDto)}`,
    );
    return await this.commonService.tryCatchWrapper(
      await this.patientService.update(queryRunner, id, updatePatientDto),
      queryRunner,
      log,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'removePatient',
      `id: ${id}`,
    );
    return await this.commonService.tryCatchWrapper(
      await this.patientService.remove(queryRunner, id),
      queryRunner,
      log,
    );
  }
}
