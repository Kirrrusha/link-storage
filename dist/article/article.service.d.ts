import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { TagEntity } from '../tag/entities/tag.entity';
export declare class ArticleService {
    private artilcleRepository;
    private tagRepository;
    constructor(artilcleRepository: Repository<ArticleEntity>, tagRepository: Repository<TagEntity>);
    create(createArticleDto: CreateArticleDto): Promise<ArticleEntity>;
    findAll(): Promise<ArticleEntity[]>;
    findOne(id: number): Promise<ArticleEntity>;
    update(id: number, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity>;
    remove(id: number): Promise<void>;
}
