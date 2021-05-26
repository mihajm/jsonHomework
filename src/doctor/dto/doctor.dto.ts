import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CreatePatientDto } from 'src/patient/dto/patient.dto';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'The Doctors unique id as a string',
    example: '100',
  })
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: 'The department the doctor works in as a string',
    example: 'marand',
  })
  @IsString()
  readonly department: string;

  @ApiProperty({
    description: 'An array of the doctors patients as json objects',
    example: ['extremely_happy', 'understands_REST'],
  })
  @IsArray()
  readonly patients?: CreatePatientDto[];
}

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
