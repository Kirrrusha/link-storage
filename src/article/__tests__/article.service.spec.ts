import { Test } from '@nestjs/testing';
import { ArticleService } from '../article.service';
import { ArticleEntity } from '../entities/article.entity';
import { In, Repository } from 'typeorm';
import { TypeOrmSQLITETestingModule } from '../../../test/TypeORMSQLITETestingModule';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagEntity } from '../../tag/entities/tag.entity';

describe('ArticleService', () => {
  let articleService: ArticleService;
  let articleRepo: Repository<ArticleEntity>;
  let tagRepo: Repository<TagEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule([ArticleEntity, TagEntity])],
      providers: [ArticleService],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);
    articleRepo = module.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity),
    );
    tagRepo = module.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));
  });

  afterEach(async () => {
    await articleRepo.clear();
    await tagRepo.clear();
  });

  it('should be defined', () => {
    expect(articleService).toBeDefined();
    expect(articleRepo).toBeDefined();
    expect(tagRepo).toBeDefined();
  });

  it('should create article record with tags', async () => {
    const createdTag1 = await tagRepo.insert({
      name: 'tag1',
    });

    const createdTag2 = await tagRepo.insert({
      name: 'tag2',
    });

    const result = await articleService.create({
      url: 'url',
      content: 'content',
      tags: [createdTag1.raw, createdTag2.raw],
    });

    const tags = await tagRepo.find({
      where: { id: In([createdTag1.raw, createdTag2.raw]) },
    });

    expect(result).toEqual(
      expect.objectContaining({
        url: 'url',
        content: 'content',
        tags,
      }),
    );
  });

  it('should create article record without tags', async () => {
    const result = await articleService.create({
      url: 'url',
      content: 'content',
      tags: [],
    });

    expect(result).toEqual(
      expect.objectContaining({
        url: 'url',
        content: 'content',
        tags: [],
      }),
    );
  });

  it('should edit article record with tags', async () => {
    const createdTag1 = await tagRepo.insert({
      name: 'tag1',
    });

    const createdTag2 = await tagRepo.insert({
      name: 'tag2',
    });

    const resultCreate = await articleService.create({
      url: 'url',
      content: 'content',
      tags: [createdTag1.raw],
    });

    const tags1 = await tagRepo.find({
      where: { id: In([createdTag1.raw]) },
    });

    expect(resultCreate).toEqual(
      expect.objectContaining({
        url: 'url',
        content: 'content',
        tags: tags1,
      }),
    );

    const resultEdit = await articleService.update(resultCreate.id, {
      url: 'url1',
      content: 'content1',
      tags: [createdTag1.raw, createdTag2.raw],
    });

    const tags2 = await tagRepo.find({
      where: { id: In([createdTag1.raw, createdTag2.raw]) },
    });

    expect(resultEdit).toEqual(
      expect.objectContaining({
        url: 'url1',
        content: 'content1',
        tags: tags2,
      }),
    );
  });
});
