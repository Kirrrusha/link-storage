import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticleService {
    create(createArticleDto: CreateArticleDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateArticleDto: UpdateArticleDto): string;
    remove(id: number): string;
}
