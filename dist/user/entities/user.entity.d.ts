import { RoleEnum } from '../enums/role.enum';
import { StatusEnum } from '../enums/status.enum';
export declare class UserEntity {
    id: number;
    email: string;
    password: string;
    role: RoleEnum.admin | RoleEnum.user;
    status: StatusEnum.pending | StatusEnum.blocked | StatusEnum.active;
    validatePassword(password: string): Promise<boolean>;
}
