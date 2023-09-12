import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    type: String,
  })
  url: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  tags?: number[];
}
