import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from '@prisma/client';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    create(createTagDto: CreateTagDto): Promise<Tag>;
    findAll(): Promise<Tag[]>;
    findOne(id: string): Promise<Tag>;
    update(id: string, updateTagDto: UpdateTagDto): Promise<Tag>;
    remove(id: string): Promise<void>;
}
