import { DataSource, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { StatusEnum } from './enums/status.enum';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }
    private readonly saltRounds = 10;

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const { role, email } = createUserDto;
        const salt = await bcrypt.genSalt(this.saltRounds);
        const password = await this.hashPassword(createUserDto.password, salt);
        const user = this.save({
            email,
            role,
            status: StatusEnum.pending,
            password,
        });
        return user;
    }

    async validateUserPassword(
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<UserEntity | null> {
        try {
            const { email, password } = authCredentialsDto;
            const user = await this.findOne({ where: { email } });
            console.log('user', user);

            if (user && (await user.validatePassword(password))) {
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error('validateUserPassword', error)
        }
    }
    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async getAll(): Promise<UserEntity[]> {
        return this.find();
    }

    async findById(id: number): Promise<UserEntity> {
        return await this.findOne({ where: { id } });
    }

    async verifyUser({ id, status }): Promise<UserEntity> {
        if (status !== StatusEnum.pending) {
            throw new BadRequestException({
                message: 'Invalid status',
                code: 400
            })
        }
        try {
            const user = await this.save({ id, status: StatusEnum.active });
            return user;
        } catch (error) {
            console.error(error);
        }
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return this.findOne({ where: { email } });
    }

    async updateUser(id: number, payload: Partial<UserEntity>) {
        try {
            const { email } = payload;
            const user = await this.save({ id, email });

            return user;
        } catch (error) {
            console.error('error', error);
        }
    }

    async deleteUser(id: number): Promise<void> {
        const result = await this.delete(id);
        if (!result.affected) {
            throw new NotFoundException();
        }
    }
}
