import { Logger, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { ArticleEntity } from '../article/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, ArticleEntity])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule { }
