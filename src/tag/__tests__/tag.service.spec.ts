import { Test } from '@nestjs/testing';
import { TagService } from '../TagService';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

describe('TagService', () => {
  let tagService: TagService;
  let prismaService: PrismaService;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [TagService, PrismaService],
    }).compile();

    tagService = moduleFixture.get<TagService>(TagService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    prisma = prismaService.getPrismaClient();
  });

  afterEach(async () => {
    await prisma.tag.deleteMany({});
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(tagService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should return empty list', async () => {
    const result = await tagService.findAll();
    expect(result.length).toBe(0);
  });

  it('check tag returned data', async () => {
    const tag = await tagService.create({
      name: 'title',
    });

    const result = await prisma.tag.findUnique({
      where: { id: tag.id },
    });
    expect(result).toEqual(
      expect.objectContaining({
        name: 'title',
      }),
    );
  });

  it('should return error, cant find record', async () => {
    await expect(tagService.findOne(1)).rejects.toThrowError(BadRequestException);
  });

  it('should edit record', async () => {
    const tag = await prisma.tag.create({
      data: {
        name: 'WasteCategory1',
      },
    });

    const updateResult = await tagService.update(tag.id, {
      name: 'title2',
    });

    expect(updateResult).toEqual(
      expect.objectContaining({
        name: 'title2',
        articles: [],
      }),
    );

    const tagFindResult = await prisma.tag.findUnique({
      where: {
        id: updateResult.id,
      },
      include: {
        articles: true,
      },
    });

    expect(tagFindResult).toEqual(expect.objectContaining(updateResult));
  });

  it('should remove record', async () => {
    const result = await prisma.tag.create({
      data: { name: 'title' },
    });
    const result1 = await prisma.tag.findMany({});
    expect(result1.length).toEqual(1);

    await tagService.remove(result.id);
    const result2 = await prisma.tag.findMany({});
    expect(result2.length).toEqual(0);
  });
});
