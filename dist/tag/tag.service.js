"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tag_entity_1 = require("./entities/tag.entity");
const article_entity_1 = require("../article/entities/article.entity");
let TagService = class TagService {
    constructor(tagRepository, artilcleRepository) {
        this.tagRepository = tagRepository;
        this.artilcleRepository = artilcleRepository;
    }
    async create(createTagDto) {
        const { articles: articleIds, name } = createTagDto;
        let articles = [];
        if (articleIds.length) {
            articles = await this.artilcleRepository.find({
                where: { id: typeorm_2.In(articleIds) },
            });
        }
        const result = await this.tagRepository.save({
            name,
            articles,
        });
        return result;
    }
    async findAll() {
        return this.tagRepository.find({
            relations: ['articles'],
        });
    }
    async findOne(id) {
        const result = await this.tagRepository.findOne({
            where: { id },
            relations: ['articles'],
        });
        if (!result) {
            throw new common_1.NotFoundException();
        }
        return result;
    }
    async update(id, updateTagDto) {
        const { articles: articleIds, name } = updateTagDto;
        let articles = [];
        if (articleIds.length) {
            articles = await this.artilcleRepository.find({
                where: { id: typeorm_2.In(articleIds) },
                relations: ['articles'],
            });
        }
        return this.tagRepository.save({
            id,
            name,
            articles,
        });
    }
    async remove(id) {
        const result = await this.tagRepository.delete(id);
        if (!result.affected) {
            throw new common_1.NotFoundException();
        }
    }
};
TagService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tag_entity_1.TagEntity)),
    __param(1, typeorm_1.InjectRepository(article_entity_1.ArticleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TagService);
exports.TagService = TagService;
//# sourceMappingURL=tag.service.js.map