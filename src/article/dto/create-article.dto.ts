import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    type: String,
  })
  url: string;

  @ApiProperty({
    type: String,
  })
  content: string;

  @ApiPropertyOptional({
    type: Array<number>,
  })
  tags?: number[];
}
