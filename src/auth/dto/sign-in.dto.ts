import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'user@email.ru' })
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/, { message: 'Пароль слишком слабый' })
  @ApiProperty({ default: 'qwerty123' })
  password: string;
}
