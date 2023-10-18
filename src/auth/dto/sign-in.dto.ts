import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsNotEmpty({ message: 'Поле email не должно быть пустым' })
  @IsEmail({}, { message: 'Email должен быть валидным' })
  @ApiProperty({ default: 'user@email.ru' })
  email: string;

  @IsNotEmpty({ message: 'Поле пароль не должно быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(3, { message: 'Пароль слишком короткий' })
  @MaxLength(20, { message: 'Пароль слишком длинный' })
  @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/, { message: 'Пароль слишком слабый' })
  @ApiProperty({ default: 'qwerty123' })
  password: string;
}
