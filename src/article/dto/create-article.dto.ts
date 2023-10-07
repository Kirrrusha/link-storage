import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Validate } from 'class-validator';
import { ContentToNoIsActiveValidator } from '../validators/content-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    type: String,
  })
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  isArticle?: boolean;

  @IsOptional()
  @IsString()
  @Validate(ContentToNoIsActiveValidator)
  @ApiPropertyOptional()
  content?: string;

  @IsOptional()
  @IsInt({ each: true })
  @ApiPropertyOptional()
  tags?: number[];
}
