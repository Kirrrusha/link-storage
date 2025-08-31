import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({ description: 'Заголовок ссылки' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'URL ссылки' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Контент статьи', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Является ли статьей', required: false })
  @IsOptional()
  @IsBoolean()
  isArticle?: boolean;

  @ApiProperty({ description: 'Теги', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}