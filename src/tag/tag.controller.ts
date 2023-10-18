import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TagService } from './TagService';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('tags')
@ApiTags('Article Tags')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Create tag' })
  create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiCreatedResponse({ description: 'Get all tags' })
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ description: 'Get tag by id' })
  findOne(@Param('id') id: string): Promise<Tag> {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ description: 'Update tag' })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto): Promise<Tag> {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ description: 'Remove tag by id' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tagService.remove(+id);
  }
}
