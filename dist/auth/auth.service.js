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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const create_user_dto_1 = require("../user/dto/create-user.dto");
const token_service_1 = require("../token/token.service");
const mail_service_1 = require("../mail/mail.service");
const dayjs_1 = __importDefault(require("dayjs"));
const user_service_1 = require("../user/user.service");
const status_enum_1 = require("../user/enums/status.enum");
let AuthService = class AuthService {
    constructor(userService, configService, tokenService, mailService) {
        this.userService = userService;
        this.configService = configService;
        this.tokenService = tokenService;
        this.mailService = mailService;
        this.backendAppUrl = this.configService.get('BE_API_URL');
    }
    async signUp(createUserDto) {
        try {
            const candidate = await this.userService.findByEmail(createUserDto.email);
            console.log('candidate', candidate);
            if (candidate) {
                throw new common_1.BadRequestException(`Пользователь с почтовым адресом ${createUserDto.email} уже существует`);
            }
            const user = await this.userService.create(createUserDto);
            console.log('user', user);
            const tokens = await this.tokenService.createAuthTokens({
                userId: user.id,
                status: user.status,
                role: user.role,
            });
            console.log('tokens', tokens);
            return Object.assign({}, tokens);
        }
        catch (e) {
            throw new common_1.BadRequestException('Something went wrong');
        }
    }
    async signIn(authCredentialsDto) {
        const candidate = await this.userService.findByEmail(authCredentialsDto.email);
        if (!candidate) {
            throw new common_1.BadRequestException(`Пользователь с почтовым адресом ${authCredentialsDto.email} не существует`);
        }
        const user = await this.userService.validateUserPassword(authCredentialsDto);
        if (!user) {
            throw new common_1.UnauthorizedException('Невалидный email или пароль');
        }
        const authTokens = await this.tokenService.createAuthTokens({
            userId: user.id,
            status: user.status,
            role: user.role,
        });
        return authTokens;
    }
    async refreshTokens(payload) {
        const { expireAt, userId } = await this.tokenService.findRefreshToken(payload.refreshToken);
        await this.tokenService.deleteRefreshToken(payload.refreshToken);
        if (!dayjs_1.default().isAfter(expireAt)) {
            new common_1.UnauthorizedException('TOKEN_EXPIRED');
        }
        const user = await this.userService.findById(userId);
        const tokens = await this.tokenService.createAuthTokens({
            userId: userId,
            status: user.status,
            role: user.role,
        });
        return tokens;
    }
    async verifyUser(token) {
        const result = this.tokenService.decodeToken(token);
        return this.userService.verifyUser({
            id: result.id,
            status: result.status,
        });
    }
    async sendConfirmation(user) {
        const expiresIn = 60 * 60 * 24;
        const tokenPayload = {
            id: user.id,
            status: status_enum_1.StatusEnum.pending,
        };
        const token = await this.tokenService.generateToken(tokenPayload, {
            expiresIn,
        });
        const confirmLink = `${this.backendAppUrl}/auth/confirm?token=${token}`;
        await this.mailService.send({
            from: this.configService.get('JS_CODE_MAIL'),
            to: user.email,
            subject: 'Verify User',
            html: `
                <h3>Привет новый пользователь!</h3>
                <p>Пожалуйста используйте эту <a href="${confirmLink}">ссылку</a> для подтверждения аккаунта</p>
            `,
        });
    }
    async logout(refreshToken) {
        await this.tokenService.deleteRefreshToken(refreshToken);
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService,
        token_service_1.TokenService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map