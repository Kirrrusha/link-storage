import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../article.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

describe('ArticleService', () => {
  let articleService: ArticleService;
  let prismaService: PrismaService;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [ArticleService, PrismaService],
    }).compile();

    articleService = moduleFixture.get<ArticleService>(ArticleService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    prisma = prismaService.getPrismaClient();
  });

  afterEach(async () => {
    await prisma.article.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(articleService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should create article record with tags', async () => {
    const createdTag1 = await prisma.tag.create({
      data: {
        name: 'tag1',
      },
    });

    const createdTag2 = await prisma.tag.create({
      data: {
        name: 'tag2',
      },
    });

    const result = await articleService.create({
      url: 'url',
      content: 'content',
      tags: [createdTag1.id, createdTag2.id],
    });

    expect(result).toEqual(
      expect.objectContaining({
        url: 'url',
        content: 'content',
        tags: [createdTag1, createdTag2],
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
    const createdTag1 = await prisma.tag.create({
      data: {
        name: 'tag1',
      },
    });

    const createdTag2 = await prisma.tag.create({
      data: {
        name: 'tag2',
      },
    });

    const resultCreate = await articleService.create({
      url: 'url',
      content: 'content',
      tags: [createdTag1.id],
    });

    const tags1 = await prisma.tag.findUnique({
      where: { id: createdTag1.id },
    });

    expect(resultCreate).toEqual(
      expect.objectContaining({
        url: 'url',
        content: 'content',
        tags: [tags1],
      }),
    );

    const resultEdit = await articleService.update(resultCreate.id, {
      tags: [createdTag1.id, createdTag2.id],
    });

    const tags2 = await prisma.tag.findMany({
      where: { id: { in: [createdTag1.id, createdTag2.id] } },
    });

    expect(resultEdit).toEqual(
      expect.objectContaining({
        url: 'url',
        content: 'content',
        tags: tags2,
      }),
    );
  });
});
