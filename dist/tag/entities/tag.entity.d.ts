import { ArticleEntity } from '../../article/entities/article.entity';
export declare class TagEntity {
    id: number;
    name: string;
    articles: ArticleEntity[];
}
