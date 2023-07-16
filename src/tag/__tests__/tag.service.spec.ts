import { Test } from '@nestjs/testing';
import { TagService } from '../tag.service';
import { TypeOrmSQLITETestingModule } from '../../../test/TypeORMSQLITETestingModule';
import { TagEntity } from '../entities/tag.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TagService', () => {
  let tagService: TagService;
  let tagRepo: Repository<TagEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule([TagEntity])],
      providers: [TagService],
    }).compile();

    tagService = module.get<TagService>(TagService);
    tagRepo = module.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));
  });

  afterEach(async () => {
    await tagRepo.clear();
  });

  it('should be defined', () => {
    expect(tagService).toBeDefined();
    expect(tagRepo).toBeDefined();
  });

  it('should return empty list', async () => {
    const result = await tagService.findAll();
    expect(result.length).toBe(0);
  });

  it('check tag returned data', async () => {
    const tag = await tagService.create({
      name: 'title',
    });

    const result = await tagService.findOne(tag.id);
    expect(result).toEqual(
      expect.objectContaining({
        name: 'title',
      }),
    );
  });

  it('should return error, cant find record', async () => {
    await expect(tagService.findOne(1)).rejects.toThrowError(NotFoundException);
  });

  it('should edit record', async () => {
    const tag = await tagService.create({
      name: 'WasteCategory1',
    });

    const result = await tagService.update(tag.id, {
      name: 'title2',
    });

    expect(result).toEqual(
      expect.objectContaining({
        name: 'title2',
      }),
    );
  });

  it('should remove record', async () => {
    const result = await tagService.create({
      name: 'title',
    });
    const result1 = await tagRepo.find();
    expect(result1.length).toEqual(1);

    await tagService.remove(result.id);
    const result2 = await tagRepo.find();
    expect(result2.length).toEqual(0);
  });
});
