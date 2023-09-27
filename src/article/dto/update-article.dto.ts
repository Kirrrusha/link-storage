import { PickType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PickType(CreateArticleDto, ['tags']) {}
