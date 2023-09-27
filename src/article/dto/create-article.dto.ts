import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Validate } from 'class-validator';
import { CustomContentValidator } from '../validators/content-validator';

export class CreateArticleDto {
  @IsUrl()
  @ApiProperty({
    type: String,
  })
  url: string;

  @IsString()
  @ApiProperty()
  title: string;

  @ApiProperty()
  isArticle: boolean;

  @IsOptional()
  @IsString()
  @Validate(CustomContentValidator)
  @ApiPropertyOptional()
  content?: string;

  @IsInt({ each: true })
  @ApiPropertyOptional()
  tags?: number[];
}
