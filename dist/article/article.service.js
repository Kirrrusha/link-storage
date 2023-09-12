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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const article_entity_1 = require("./entities/article.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const tag_entity_1 = require("../tag/entities/tag.entity");
let ArticleService = class ArticleService {
    constructor(artilcleRepository, tagRepository) {
        this.artilcleRepository = artilcleRepository;
        this.tagRepository = tagRepository;
    }
    async create(createArticleDto) {
        const { tags: tagIds } = createArticleDto, payload = __rest(createArticleDto, ["tags"]);
        let tags = [];
        if (tagIds.length) {
            tags = await this.tagRepository.find({
                where: { id: typeorm_1.In(tagIds) },
            });
        }
        const result = await this.artilcleRepository.save(Object.assign({ tags }, payload));
        return result;
    }
    async findAll() {
        return this.artilcleRepository.find({
            relations: ['tags'],
        });
    }
    async findOne(id) {
        const result = await this.artilcleRepository.findOne({
            where: { id },
            relations: ['tags'],
        });
        if (!result) {
            throw new common_1.NotFoundException();
        }
        return result;
    }
    async update(id, updateArticleDto) {
        const { tags: tagIds } = updateArticleDto, payload = __rest(updateArticleDto, ["tags"]);
        let tags = [];
        if (tagIds.length) {
            tags = await this.tagRepository.find({
                where: { id: typeorm_1.In(tagIds) },
            });
        }
        return this.artilcleRepository.save(Object.assign({ id,
            tags }, payload));
    }
    async remove(id) {
        const result = await this.artilcleRepository.delete(id);
        if (!result.affected) {
            throw new common_1.NotFoundException();
        }
    }
};
ArticleService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(article_entity_1.ArticleEntity)),
    __param(1, typeorm_2.InjectRepository(tag_entity_1.TagEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], ArticleService);
exports.ArticleService = ArticleService;
//# sourceMappingURL=article.service.js.map