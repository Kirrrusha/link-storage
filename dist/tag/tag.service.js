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
var TagService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TagService = TagService_1 = class TagService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TagService_1.name);
    }
    async create(createTagDto) {
        try {
            const { articles = [], name } = createTagDto;
            this.logger.log(`CREATE PENDING`);
            const result = await this.prisma.tag.create({
                data: {
                    name,
                    articles: {
                        connect: articles.map((id) => ({ id })),
                    },
                },
                include: {
                    articles: true,
                },
            });
            this.logger.log(`CREATE SUCCESS`);
            return result;
        }
        catch (error) {
            this.logger.log(`CREATE ERROR ${String(error)}`);
            throw new common_1.BadRequestException(error);
        }
    }
    async findAll() {
        try {
            this.logger.log(`FIND_ALL PENDING`);
            const result = await this.prisma.tag.findMany();
            this.logger.log(`FIND_ALL SUCCESS`);
            return result;
        }
        catch (error) {
            this.logger.log(`FIND_ALL ERROR ${String(error)}`);
            throw new common_1.BadRequestException(error);
        }
    }
    async findOne(id) {
        const prefix = `[TAG ID: ${id}]`;
        try {
            this.logger.log(`FIND_ONE ${prefix} PENDING`);
            const result = await this.prisma.tag.findUnique({
                where: { id },
                include: {
                    articles: true,
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
    async update(id, updateTagDto) {
        const prefix = `[TAG ID: ${id}]`;
        try {
            this.logger.log(`UPDATE ${prefix} PENDING`);
            const { articles = [], name } = updateTagDto;
            const tag = await this.prisma.tag.update({
                where: { id },
                data: {
                    name,
                    articles: {
                        connect: articles.map((id) => ({ id })),
                    },
                },
                include: {
                    articles: true,
                },
            });
            this.logger.log(`UPDATE ${prefix} SUCCESS`);
            return tag;
        }
        catch (error) {
            this.logger.error(`UPDATE ${prefix} ${String(error)}`);
            throw new common_1.BadRequestException(error);
        }
    }
    async remove(id) {
        const prefix = `[TAG ID: ${id}]`;
        try {
            this.logger.log(`REMOVE ${prefix} PENDING`);
            const result = await this.prisma.tag.delete({ where: { id } });
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
TagService = TagService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagService);
exports.TagService = TagService;
//# sourceMappingURL=tag.service.js.map