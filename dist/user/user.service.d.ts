import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
export declare class UserService {
    private userRepository;
    private readonly saltRounds;
    constructor(userRepository: UserRepository);
    findByEmail(email: string): Promise<UserEntity>;
    findById(id: number): Promise<UserEntity>;
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: number): Promise<void>;
    findAll(): Promise<UserEntity[]>;
    validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<UserEntity | null>;
    verifyUser(payload: any): Promise<UserEntity>;
    private hashPassword;
}
