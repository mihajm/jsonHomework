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
import { DoctorService } from './doctor.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';

@ApiTags('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly commonService: CommonService,
  ) {}

  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'findAllDoctors',
      null,
    );
    return await this.commonService.tryCatchWrapper(
      await this.doctorService.findAll(queryRunner, paginationQuery),
      queryRunner,
      log,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'findOneDoctor',
      `id: ${id}`,
    );
    return await this.commonService.tryCatchWrapper(
      await this.doctorService.findOne(queryRunner, id, false),
      queryRunner,
      log,
    );
  }

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'saveDoctor',
      JSON.stringify(createDoctorDto),
    );
    return await this.commonService.tryCatchWrapper(
      await this.doctorService.save(queryRunner, createDoctorDto),
      queryRunner,
      log,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'saveDoctor',
      `id: ${id}, payload: ${JSON.stringify(updateDoctorDto)}`,
    );
    return await this.commonService.tryCatchWrapper(
      await this.doctorService.update(queryRunner, id, updateDoctorDto),
      queryRunner,
      log,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { queryRunner, log } = await this.commonService.provideQr(
      'removeDoctor',
      `id: ${id}`,
    );
    return await this.commonService.tryCatchWrapper(
      await this.doctorService.remove(queryRunner, id),
      queryRunner,
      log,
    );
  }
}
