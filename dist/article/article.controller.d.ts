import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
export declare class ArticleController {
    private readonly articleService;
    constructor(articleService: ArticleService);
    create(createArticleDto: CreateArticleDto): Promise<ArticleEntity>;
    findAll(): Promise<ArticleEntity[]>;
    findOne(id: string): Promise<ArticleEntity>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity>;
    remove(id: string): Promise<void>;
}
