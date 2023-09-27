import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    this.userRepository.deleteUser(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User | null> {
    return this.userRepository.validateUserPassword(authCredentialsDto);
  }

  async verifyUser(id: number): Promise<User> {
    return this.userRepository.verifyUser(id);
  }
}
