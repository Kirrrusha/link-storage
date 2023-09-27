import { Role } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    fullName?: string;
    password: string;
    role: Role;
}
