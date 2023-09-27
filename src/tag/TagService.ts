import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Tag } from '@prisma/client';
import { COMMON_EXCEPTION_ERROR } from '../constants/common.constants';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const { articles = [], name } = createTagDto;
      this.logger.log(`CREATE PENDING`);

      const result = await this.prisma.tag.create({
        data: {
          name,
          articles: {
            connect: articles.map((id) => ({ id })),
          },
        },
        include: {
          articles: true,
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

      const result = await this.prisma.tag.findMany();
      this.logger.log(`FIND_ALL SUCCESS`);

      return result;
    } catch (error) {
      this.logger.log(`FIND_ALL ERROR ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async findOne(id: number): Promise<Tag> {
    const prefix = `[TAG ID: ${id}]`;
    try {
      this.logger.log(`FIND_ONE ${prefix} PENDING`);

      const result = await this.prisma.tag.findUnique({
        where: { id },
        include: {
          articles: true,
        },
      });

      if (!result) {
        this.logger.error(`FIND_ONE ${prefix} NOT FOUND`);
        // throw new NotFoundException(NOT_FOUND_TAG);
      }
      this.logger.log(`FIND_ONE ${prefix} SUCCESS`);
      return result;
    } catch (error) {
      this.logger.error(`FIND_ONE ${prefix} ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const prefix = `[TAG ID: ${id}]`;
    try {
      this.logger.log(`UPDATE ${prefix} PENDING`);

      const { articles = [], name } = updateTagDto;

      const tag = await this.prisma.tag.update({
        where: { id },
        data: {
          name,
          articles: {
            connect: articles.map((id) => ({ id })),
          },
        },
        include: {
          articles: true,
        },
      });

      this.logger.log(`UPDATE ${prefix} SUCCESS`);
      return tag;
    } catch (error) {
      this.logger.error(`UPDATE ${prefix} ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async remove(id: number): Promise<void> {
    const prefix = `[TAG ID: ${id}]`;
    try {
      this.logger.log(`REMOVE ${prefix} PENDING`);

      const result = await this.prisma.tag.delete({ where: { id } });
      if (!result) {
        this.logger.error(`REMOVE ${prefix} NOT FOUND`);
        throw new NotFoundException();
      }
      this.logger.log(`REMOVE ${prefix} SUCCESS`);
    } catch (error) {
      this.logger.error(`REMOVE ${prefix} ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }
}
