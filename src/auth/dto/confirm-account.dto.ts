import { IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAccountDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  @ApiProperty()
  token: string;
}
