import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
export declare class TagService {
    private tagRepository;
    constructor(tagRepository: Repository<TagEntity>);
    create(createTagDto: CreateTagDto): Promise<TagEntity>;
    findAll(): Promise<TagEntity[]>;
    findOne(id: number): Promise<TagEntity>;
    update(id: number, updateTagDto: UpdateTagDto): Promise<TagEntity>;
    remove(id: number): Promise<void>;
}
