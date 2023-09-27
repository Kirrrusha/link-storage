import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(id: number): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.Status;
    }>;
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.Status;
    }>;
    findAll(): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.Status;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.Status;
    }>;
}
