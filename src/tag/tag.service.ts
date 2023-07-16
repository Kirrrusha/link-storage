import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) { }

  async create(createTagDto: CreateTagDto): Promise<TagEntity> {
    const result = await this.tagRepository.save({
      ...createTagDto,
    });

    return result;
  }

  findAll() {
    return this.tagRepository.find();
  }

  async findOne(id: number): Promise<TagEntity> {
    const result = await this.tagRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<TagEntity> {
    return this.tagRepository.save({
      id,
      ...updateTagDto,
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.tagRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
