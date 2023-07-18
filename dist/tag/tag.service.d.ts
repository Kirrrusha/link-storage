import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
import { ArticleEntity } from '../article/entities/article.entity';
export declare class TagService {
    private tagRepository;
    private artilcleRepository;
    constructor(tagRepository: Repository<TagEntity>, artilcleRepository: Repository<ArticleEntity>);
    create(createTagDto: CreateTagDto): Promise<TagEntity>;
    findAll(): Promise<TagEntity[]>;
    findOne(id: number): Promise<TagEntity>;
    update(id: number, updateTagDto: UpdateTagDto): Promise<TagEntity>;
    remove(id: number): Promise<void>;
}
