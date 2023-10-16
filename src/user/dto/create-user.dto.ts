import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    default: 'mister-test@test.ru',
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    default: 'Мистер Тест',
  })
  fullName?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'YgzuQ2yj9A2Rsw',
  })
  password: string;
}
