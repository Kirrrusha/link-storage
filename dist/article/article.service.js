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
var ArticleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ArticleService = ArticleService_1 = class ArticleService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ArticleService_1.name);
    }
    async create(createArticleDto) {
        try {
            const { tags: tagIds = [], url, content } = createArticleDto;
            this.logger.log(`CREATE PENDING`);
            const result = await this.prisma.article.create({
                data: {
                    url,
                    content,
                    tags: {
                        connect: tagIds.map((id) => ({ id })),
                    },
                },
                include: {
                    tags: true,
                },
            });
            this.logger.log(`CREATE SUCCESS`);
            return result;
        }
        catch (error) {
            this.logger.log(`CREATE ERROR ${String(error)}`);
            throw new common_1.NotFoundException(error);
        }
    }
    async findAll() {
        try {
            this.logger.log(`FIND_ALL PENDING`);
            const result = await this.prisma.article.findMany();
            this.logger.log(`FIND_ALL SUCCESS`);
            return result;
        }
        catch (error) {
            this.logger.log(`FIND_ALL ERROR ${String(error)}`);
            throw new common_1.BadRequestException(error);
        }
    }
    async findOne(id) {
        const prefix = `[ARTICLE ID: ${id}]`;
        try {
            this.logger.log(`FIND_ONE ${prefix} PENDING`);
            const result = await this.prisma.article.findUnique({
                where: { id },
                include: {
                    tags: true,
                },
            });
            if (!result) {
                this.logger.error(`FIND_ONE ${prefix} NOT FOUND`);
                throw new common_1.NotFoundException();
            }
            this.logger.log(`FIND_ONE ${prefix} SUCCESS`);
            return result;
        }
        catch (error) {
            this.logger.error(`FIND_ONE ${prefix} ${String(error)}`);
            throw new common_1.BadRequestException(error);
        }
    }
    async update(id, updateArticleDto) {
        const prefix = `[ARTICLE ID: ${id}]`;
        try {
            this.logger.log(`UPDATE ${prefix} PENDING`);
            const { tags: tagIds = [] } = updateArticleDto;
            const article = await this.prisma.article.update({
                where: { id },
                data: {
                    tags: {
                        connect: tagIds.map((tagId) => ({
                            id: tagId,
                        })),
                    },
                },
                include: {
                    tags: true,
                },
            });
            this.logger.log(`UPDATE ${prefix} SUCCESS`);
            return article;
        }
        catch (error) {
            this.logger.error(`UPDATE ${prefix} ${String(error)}`);
            throw new common_1.BadRequestException(error);
        }
    }
    async remove(id) {
        const prefix = `[ARTICLE ID: ${id}]`;
        try {
            this.logger.log(`REMOVE ${prefix} PENDING`);
            const result = await this.prisma.article.delete({ where: { id } });
            if (!result) {
                this.logger.error(`REMOVE ${prefix} NOT FOUND`);
                throw new common_1.NotFoundException();
            }
            this.logger.log(`REMOVE ${prefix} SUCCESS`);
        }
        catch (error) {
            this.logger.error(`REMOVE ${prefix} ${String(error)}`);
            throw new common_1.BadRequestException(error);
        }
    }
};
ArticleService = ArticleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticleService);
exports.ArticleService = ArticleService;
//# sourceMappingURL=article.service.js.map