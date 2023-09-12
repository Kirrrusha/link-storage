import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { StatusEnum } from './enums/status.enum';
import { RoleEnum } from './enums/role.enum';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) { }

  async findByEmail(email: string): Promise<UserEntity> {

    try {
      const result = await this.userRepository.findOne({
        where: { email },
      })
      return result;
    } catch (e) {
      console.log('error findByEmail', e);
    }
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const password = await this.hashPassword(createUserDto.password, salt);
      const result = await this.userRepository.save({ ...createUserDto, password, status: StatusEnum.pending, role: RoleEnum.user });
      return result
    } catch (e) {
      console.log('error create', e);
    }


    return
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userRepository.save({ id, ...updateUserDto });
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<UserEntity | null> {
    return this.userRepository.validateUserPassword(authCredentialsDto);
  }

  async verifyUser(payload): Promise<UserEntity> {
    return this.userRepository.verifyUser(payload);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
