import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Article } from '../article/article.entity';
import { Tag } from '../tag/tag.entity';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Article, Tag]),
  ],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}