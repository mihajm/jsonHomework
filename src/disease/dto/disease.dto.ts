import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateDiseaseDto {
  @ApiProperty({
    description: "The disease's name as a string, seperated by underscores",
    example: 'very_good_at_code',
  })
  @IsString()
  @Matches(/\d*/, {
    message:
      "Disease name can't contain any spaces, capitalized letters or numbers, words should be separated with an underscore. Example: 'very_good_disease_example'",
  })
  readonly name: string;
}

export class UpdateDiseaseDto extends PartialType(CreateDiseaseDto) {}
