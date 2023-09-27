import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from '@prisma/client';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    findByEmail(email: string): Promise<User>;
    findById(id: number): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    findAll(): Promise<User[]>;
    validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User | null>;
    verifyUser(id: number): Promise<User>;
}
