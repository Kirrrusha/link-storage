import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from '../tag.controller';
import { TagService } from '../TagService';
import { tagRepositoryMock } from '../mocks/tag-repo.mock';
import { BadRequestException } from '@nestjs/common';
import { Tag } from '@prisma/client';

describe('TagController', () => {
  let controller: TagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useFactory: tagRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of tags', async () => {
    const result = [
      {
        id: 1,
        name: 'waste1',
      },
      {
        id: 2,
        name: 'waste2',
      },
    ] as Tag[];

    jest.spyOn(controller['tagService'], 'findAll').mockImplementation(() => Promise.resolve(result));

    expect(await controller.findAll()).toBe(result);
  });

  it('should throw a Bad Request exception find all tags', async () => {
    jest.spyOn(controller['tagService'], 'findAll').mockRejectedValue(new BadRequestException());

    expect(controller.findAll()).rejects.toThrowError(BadRequestException);
  });

  it('should return a single tag', async () => {
    const result = {
      id: 1,
      name: 'waste1',
    } as Tag;

    jest.spyOn(controller['tagService'], 'findOne').mockImplementation(() => Promise.resolve(result));

    expect(await controller.findOne('1')).toBe(result);
  });

  it('should throw a Bad Request exception find tag', async () => {
    jest.spyOn(controller['tagService'], 'findOne').mockRejectedValue(new BadRequestException());

    expect(controller.findOne('1')).rejects.toThrowError(BadRequestException);
  });
  // TODO add create tag tests
  // TODO add edit tag tests
  // TODO add remove tag tests
});
