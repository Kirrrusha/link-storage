import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role, Status } from '@prisma/client';

export class CreateUserTokenDto {
  @IsNumber()
  @ApiProperty()
  userId: number;

  @ApiProperty({ enum: Status })
  status: Status;

  @ApiProperty({ enum: Role })
  role: Role;
}
