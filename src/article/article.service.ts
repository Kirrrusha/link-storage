import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '../tag/entities/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private artilcleRepository: Repository<ArticleEntity>,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) { }

  async create(createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const { tags: tagIds, ...payload } = createArticleDto;
    let tags = [];

    if (tagIds.length) {
      tags = await this.tagRepository.find({
        where: { id: In(tagIds) },
      });
    }

    const result = await this.artilcleRepository.save({
      tags,
      ...payload,
      // ...createArticleDto,
    });

    return result;
  }

  async findAll(): Promise<ArticleEntity[]> {
    return this.artilcleRepository.find({
      relations: ['tags'],
    });
  }

  async findOne(id: number): Promise<ArticleEntity> {
    const result = await this.artilcleRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const { tags: tagIds, ...payload } = updateArticleDto;

    let tags = [];

    if (tagIds.length) {
      tags = await this.tagRepository.find({
        where: { id: In(tagIds) },
      });
    }

    return this.artilcleRepository.save({
      id,
      tags,
      ...payload,
      // ...updateArticleDto,
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.artilcleRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
