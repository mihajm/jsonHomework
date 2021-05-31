import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateLoggedEventDto {
  @ApiProperty({
    description: 'Reference to the execution context of the log',
    example: 'doctorService',
  })
  @IsString()
  context: string;

  @ApiProperty({
    description: 'The json payload, which was recieved, can be null',
    example: "{'id': '100', 'department': 'marand'}",
  })
  @IsOptional()
  @IsString()
  payload?: string;

  @ApiProperty({
    description: 'The error msg sent to the user, can be null',
    example: 'marand',
  })
  @IsOptional()
  @IsString()
  errorMsg?: string;
}
