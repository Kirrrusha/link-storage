import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../article/article.entity';
import { Tag } from '../tag/tag.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createLinkDto: CreateLinkDto): Promise<Article> {
    const article = this.articleRepository.create({
      title: createLinkDto.title,
      url: createLinkDto.url,
      content: createLinkDto.content,
      isArticle: createLinkDto.isArticle || false,
    });

    const savedArticle = await this.articleRepository.save(article);

    if (createLinkDto.tags && createLinkDto.tags.length > 0) {
      const tags = await this.findOrCreateTags(createLinkDto.tags);
      savedArticle.tags = tags;
      await this.articleRepository.save(savedArticle);
    }

    return this.findArticleById(savedArticle.id);
  }

  async findAll(userId?: string): Promise<Article[]> {
    return this.articleRepository.find({
      relations: ['tags'],
      order: { id: 'DESC' },
    });
  }

  async findPublic(): Promise<Article[]> {
    return this.articleRepository.find({
      relations: ['tags'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Article | null> {
    return this.findArticleById(parseInt(id));
  }

  async update(id: string, updateLinkDto: UpdateLinkDto): Promise<Article> {
    const article = await this.findOne(id);
    if (!article) {
      throw new Error(`Article with id ${id} not found`);
    }

    // Update basic fields
    if (updateLinkDto.title) article.title = updateLinkDto.title;
    if (updateLinkDto.url) article.url = updateLinkDto.url;
    if (updateLinkDto.content !== undefined) article.content = updateLinkDto.content;
    if (updateLinkDto.isArticle !== undefined) article.isArticle = updateLinkDto.isArticle;

    // Handle tags update
    if (updateLinkDto.tags) {
      const tags = await this.findOrCreateTags(updateLinkDto.tags);
      article.tags = tags;
    }

    await this.articleRepository.save(article);
    return this.findArticleById(parseInt(id));
  }

  async remove(id: string): Promise<void> {
    const result = await this.articleRepository.delete(parseInt(id));
    if (result.affected === 0) {
      throw new Error(`Article with id ${id} not found`);
    }
  }

  async findByTags(tagNames: string[], userId?: string): Promise<Article[]> {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tag')
      .where('tag.name IN (:...tagNames)', { tagNames })
      .getMany();
  }

  private async findArticleById(id: number): Promise<Article | null> {
    return this.articleRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
  }

  private async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const tagName of tagNames) {
      let tag = await this.findTagByName(tagName);

      if (!tag) {
        tag = this.tagRepository.create({ name: tagName });
        tag = await this.tagRepository.save(tag);
      }

      tags.push(tag);
    }

    return tags;
  }

  private async findTagByName(name: string): Promise<Tag | null> {
    return this.tagRepository.findOne({
      where: { name },
    });
  }
}