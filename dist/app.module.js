"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const article_module_1 = require("./article/article.module");
const tag_module_1 = require("./tag/tag.module");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const token_module_1 = require("./token/token.module");
const mail_module_1 = require("./mail/mail.module");
const prisma_module_1 = require("./prisma/prisma.module");
const app_config_module_1 = require("./app-config/app-config.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [article_module_1.ArticleModule, tag_module_1.TagModule, user_module_1.UserModule, auth_module_1.AuthModule, token_module_1.TokenModule, mail_module_1.MailModule, prisma_module_1.PrismaModule, app_config_module_1.AppConfigModule],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map