import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum } from '../enums/role.enum';
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
    default: RoleEnum,
  })
  role: RoleEnum;
}
