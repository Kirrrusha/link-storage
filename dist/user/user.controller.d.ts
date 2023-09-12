import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(id: number): Promise<import("./entities/user.entity").UserEntity>;
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").UserEntity>;
    findAll(): Promise<import("./entities/user.entity").UserEntity[]>;
    findOne(id: string): Promise<import("./entities/user.entity").UserEntity>;
}
