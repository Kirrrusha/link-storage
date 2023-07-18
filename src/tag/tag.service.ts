import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
import { ArticleEntity } from '../article/entities/article.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    @InjectRepository(ArticleEntity)
    private artilcleRepository: Repository<ArticleEntity>, // private readonly logger = new Logger(TagService.name),
  ) { }

  async create(createTagDto: CreateTagDto): Promise<TagEntity> {
    const { articles: articleIds, name } = createTagDto;

    let articles = [];

    if (articleIds.length) {
      articles = await this.artilcleRepository.find({
        where: { id: In(articleIds) },
      });
    }

    const result = await this.tagRepository.save({
      name,
      articles,
    });

    return result;
  }

  async findAll() {
    return this.tagRepository.find({
      relations: ['articles'],
    });
  }

  async findOne(id: number): Promise<TagEntity> {
    const result = await this.tagRepository.findOne({
      where: { id },
      relations: ['articles'],
    });

    if (!result) {
      // this.logger.error(`[FIND ONE] NOT FOUND`);
      throw new NotFoundException();
    }

    return result;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<TagEntity> {
    const { articles: articleIds, name } = updateTagDto;

    let articles = [];

    if (articleIds.length) {
      articles = await this.artilcleRepository.find({
        where: { id: In(articleIds) },
        relations: ['articles'],
      });
    }
    return this.tagRepository.save({
      id,
      name,
      articles,
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.tagRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
