import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDiseaseDto {
  @ApiProperty({
    description: "The disease's name as a string, seperated by underscores",
    example: 'very_good_at_code',
  })
  @IsString()
  readonly name: string;
}

export class UpdateDiseaseDto extends PartialType(CreateDiseaseDto) {}
