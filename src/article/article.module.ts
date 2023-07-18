import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { TagEntity } from 'src/tag/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, TagEntity])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule { }
