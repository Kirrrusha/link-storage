import { TagEntity } from '../../tag/entities/tag.entity';
export declare class ArticleEntity {
    id: number;
    url: string;
    content: string;
    tags: TagEntity[];
}
