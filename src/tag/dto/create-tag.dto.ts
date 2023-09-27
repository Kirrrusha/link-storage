import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiPropertyOptional()
  articles?: number[];
}
