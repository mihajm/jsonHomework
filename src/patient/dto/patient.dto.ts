import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    description: 'The Patients unique id as a string',
    example: '5',
  })
  @IsString()
  @Matches(/\d*/, {
    message: 'Patient id can only contain numbers Example: 5',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Patients first name as a string',
    example: 'Miha',
  })
  @IsString()
  @Matches(/^[A-Z][a-z]*/, {
    message:
      "First name can only contain letters, first letter must be capitalized Ex: 'Miha'",
  })
  readonly first_name: string;

  @ApiProperty({
    description: 'Patients last name as a string',
    example: 'Mulec',
  })
  @IsString()
  @Matches(/^[A-Z][a-z]*/, {
    message:
      "Last name can only contain letters, first letter must be capitalized Ex: 'Mulec'",
  })
  readonly last_name: string;

  @ApiProperty({
    description:
      'Array of the patients, optionally with diseases in an array of strings',
    example: [
      {
        first_name: 'Miha',
        last_name: 'Mulec',
        diseases: ['knows_javascript', 'learning_sql'],
      },
    ],
  })
  @IsString({ each: true })
  readonly diseases?: string[];
}

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
