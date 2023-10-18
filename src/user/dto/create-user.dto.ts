import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Поле email не должно быть пустым' })
  @IsEmail({}, { message: 'Email должен быть валидным' })
  @ApiProperty({
    default: 'mister-test@test.ru',
  })
  email: string;

  @IsOptional()
  @IsString({ message: 'Поле должен быть строкой' })
  @ApiPropertyOptional({
    default: 'Мистер Тест',
  })
  fullName?: string;

  @IsNotEmpty({ message: 'Поле пароль не должно быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @ApiProperty({
    default: 'YgzuQ2yj9A2Rsw',
  })
  password: string;
}
