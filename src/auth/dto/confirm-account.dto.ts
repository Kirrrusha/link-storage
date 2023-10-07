import { IsJWT, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAccountDto {
  @IsNotEmpty()
  @IsJWT()
  @ApiProperty()
  token: string;
}
