import { RoleEnum } from '../enums/role.enum';
export declare class CreateUserDto {
    email: string;
    fullName?: string;
    password: string;
    role: RoleEnum;
}
