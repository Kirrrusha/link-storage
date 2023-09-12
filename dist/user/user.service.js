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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_repository_1 = require("./user.repository");
const status_enum_1 = require("./enums/status.enum");
const role_enum_1 = require("./enums/role.enum");
const bcrypt_1 = __importDefault(require("bcrypt"));
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.saltRounds = 10;
    }
    async findByEmail(email) {
        try {
            const result = await this.userRepository.findOne({
                where: { email },
            });
            return result;
        }
        catch (e) {
            console.log('error findByEmail', e);
        }
    }
    async findById(id) {
        return this.userRepository.findOne({
            where: { id },
        });
    }
    async create(createUserDto) {
        try {
            const salt = await bcrypt_1.default.genSalt(this.saltRounds);
            const password = await this.hashPassword(createUserDto.password, salt);
            const result = await this.userRepository.save(Object.assign(Object.assign({}, createUserDto), { password, status: status_enum_1.StatusEnum.pending, role: role_enum_1.RoleEnum.user }));
            return result;
        }
        catch (e) {
            console.log('error create', e);
        }
        return;
    }
    async update(id, updateUserDto) {
        return this.userRepository.save(Object.assign({ id }, updateUserDto));
    }
    async remove(id) {
        const result = await this.userRepository.delete(id);
        if (!result.affected) {
            throw new common_1.NotFoundException();
        }
    }
    async findAll() {
        return this.userRepository.find();
    }
    async validateUserPassword(authCredentialsDto) {
        return this.userRepository.validateUserPassword(authCredentialsDto);
    }
    async verifyUser(payload) {
        return this.userRepository.verifyUser(payload);
    }
    async hashPassword(password, salt) {
        return bcrypt_1.default.hash(password, salt);
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map