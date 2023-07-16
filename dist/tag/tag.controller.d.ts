import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    create(createTagDto: CreateTagDto): Promise<TagEntity>;
    findAll(): Promise<TagEntity[]>;
    findOne(id: string): Promise<TagEntity>;
    update(id: string, updateTagDto: UpdateTagDto): Promise<TagEntity>;
    remove(id: string): Promise<void>;
}
