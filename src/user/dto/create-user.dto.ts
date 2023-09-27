import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    default: 'mister-test@test.ru',
  })
  email: string;

  @IsString()
  @ApiPropertyOptional({
    default: 'Мистер Тест',
  })
  fullName?: string;

  @IsString()
  @ApiProperty({
    default: 'YgzuQ2yj9A2Rsw',
  })
  password: string;

  @ApiProperty({
    default: Role,
  })
  role: Role;
}
