import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Article } from '@prisma/client';
import { COMMON_EXCEPTION_ERROR } from '../constants/common.constants';
import { NOT_FOUND } from './article.constants';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    try {
      const { tags: tagIds = [], url, content, title, isArticle = false } = createArticleDto;
      this.logger.log(`CREATE PENDING`);
      const result = await this.prisma.article.create({
        data: {
          url,
          title,
          isArticle,
          content,
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
        include: {
          tags: true,
        },
      });
      this.logger.log(`CREATE SUCCESS`);
      return result;
    } catch (error) {
      this.logger.log(`CREATE ERROR ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async findAll() {
    try {
      this.logger.log(`FIND_ALL PENDING`);

      const result = await this.prisma.article.findMany();
      this.logger.log(`FIND_ALL SUCCESS`);
      return result;
    } catch (error) {
      this.logger.log(`FIND_ALL ERROR ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async findOne(id: number): Promise<Article> {
    const prefix = `[ARTICLE ID: ${id}]`;
    try {
      this.logger.log(`FIND_ONE ${prefix} PENDING`);

      const result = await this.prisma.article.findUnique({
        where: { id },
        include: {
          tags: true,
        },
      });

      if (!result) {
        this.logger.error(`FIND_ONE ${prefix} NOT FOUND`);
        throw new NotFoundException(NOT_FOUND);
      }
      this.logger.log(`FIND_ONE ${prefix} SUCCESS`);
      return result;
    } catch (error) {
      this.logger.error(`FIND_ONE ${prefix} ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const prefix = `[ARTICLE ID: ${id}]`;
    try {
      this.logger.log(`UPDATE ${prefix} PENDING`);

      const { tags: tagIds = [] } = updateArticleDto;

      const article = await this.prisma.article.update({
        where: { id },
        data: {
          tags: {
            connect: tagIds.map((tagId) => ({
              id: tagId,
            })),
          },
        },
        include: {
          tags: true,
        },
      });

      this.logger.log(`UPDATE ${prefix} SUCCESS`);
      return article;
    } catch (error) {
      this.logger.error(`UPDATE ${prefix} ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async remove(id: number): Promise<void> {
    const prefix = `[ARTICLE ID: ${id}]`;
    try {
      this.logger.log(`REMOVE ${prefix} PENDING`);

      const result = await this.prisma.article.delete({ where: { id } });
      if (!result) {
        this.logger.error(`REMOVE ${prefix} NOT FOUND`);
        throw new NotFoundException(NOT_FOUND);
      }
      this.logger.log(`REMOVE ${prefix} SUCCESS`);
    } catch (error) {
      this.logger.error(`REMOVE ${prefix} ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }
}
