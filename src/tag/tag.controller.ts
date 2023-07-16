import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TagEntity } from './entities/tag.entity';

@Controller('tags')
@ApiTags('Article Tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Create tag' })
  create(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiCreatedResponse({ description: 'Get all tags' })
  findAll(): Promise<TagEntity[]> {
    return this.tagService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ description: 'Get tag by id' })
  findOne(@Param('id') id: string): Promise<TagEntity> {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ description: 'Update tag' })
  update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagEntity> {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ description: 'Remove tag by id' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tagService.remove(+id);
  }
}
