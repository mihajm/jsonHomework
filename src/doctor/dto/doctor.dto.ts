import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsString, Matches } from 'class-validator';
import { CreatePatientDto } from 'src/patient/dto/patient.dto';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'The Doctors unique id as a string',
    example: '100',
  })
  @IsString()
  @Matches(/\d*/, {
    message: 'Doctor id can only contain numbers Example: 100',
  })
  readonly id: string;

  @ApiProperty({
    description: 'The department the doctor works in as a string',
    example: 'marand',
  })
  @IsString()
  @Matches(/\w*/, {
    message:
      "Department name can only contain letters, words should be separated by underscore Ex: 'marand_development'",
  })
  readonly department: string;

  @ApiProperty({
    description: 'An array of the doctors patients as json objects',
    example: `[{"id": "1","first_name": "John","last_name": "Smith","diseases": ["nice_to_people","long_legs"]}]`,
  })
  @IsArray()
  readonly patients?: CreatePatientDto[];
}

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
