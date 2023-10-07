import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  name: string;

  @IsOptional()
  @IsInt({ each: true })
  @ApiPropertyOptional()
  articles?: number[];
}
