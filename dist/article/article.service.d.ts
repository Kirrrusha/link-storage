import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Article } from '@prisma/client';
export declare class ArticleService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createArticleDto: CreateArticleDto): Promise<Article>;
    findAll(): Promise<{
        id: number;
        url: string;
        content: string;
    }[]>;
    findOne(id: number): Promise<Article>;
    update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article>;
    remove(id: number): Promise<void>;
}
