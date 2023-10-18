import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  // imports: [PassportModule],
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService],
})
export class ArticleModule {}
