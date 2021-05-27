import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateLoggedEventDto {
  /*@ApiProperty({
    description: 'The dateTime object representing when the event began',
    example: '2021-05-27T09:02:36.526Z',
  })
  @IsDate()
  startTime: Date;*/
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
