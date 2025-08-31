import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinksService } from './links.service';

@ApiTags('links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую ссылку' })
  @ApiResponse({ status: 201, description: 'Ссылка успешно создана' })
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все ссылки' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Список ссылок' })
  findAll(@Query('userId') userId?: string) {
    return this.linksService.findAll(userId);
  }

  @Get('public')
  @ApiOperation({ summary: 'Получить публичные ссылки' })
  @ApiResponse({ status: 200, description: 'Список публичных ссылок' })
  findPublic() {
    return this.linksService.findPublic();
  }

  @Get('by-tags')
  @ApiOperation({ summary: 'Найти ссылки по тегам' })
  @ApiQuery({ name: 'tags', description: 'Теги через запятую' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Ссылки с указанными тегами' })
  findByTags(
    @Query('tags') tags: string,
    @Query('userId') userId?: string,
  ) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.linksService.findByTags(tagArray, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить ссылку по ID' })
  @ApiParam({ name: 'id', description: 'ID ссылки' })
  @ApiResponse({ status: 200, description: 'Ссылка найдена' })
  @ApiResponse({ status: 404, description: 'Ссылка не найдена' })
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить ссылку' })
  @ApiParam({ name: 'id', description: 'ID ссылки' })
  @ApiResponse({ status: 200, description: 'Ссылка обновлена' })
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить ссылку' })
  @ApiParam({ name: 'id', description: 'ID ссылки' })
  @ApiResponse({ status: 200, description: 'Ссылка удалена' })
  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}