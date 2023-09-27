import { IsString, MinLength, MaxLength, Matches, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({ default: 'user@email.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'qwerty123' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/, { message: 'Пароль слишком слабый' })
  password: string;
}
