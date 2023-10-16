import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Role, Status, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(private readonly prisma: PrismaService) {}
  private readonly saltRounds = 10;

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log(`CREATE PENDING`);
      const { email } = createUserDto;

      const salt = await bcrypt.genSalt(this.saltRounds).catch((error) => {
        this.logger.error(`Error generating salt: ${String(error)}`);
        throw new Error('Failed to generate salt');
      });
      const passwordHash = await this.hashPassword(createUserDto.password, salt);

      const user = this.prisma.user.create({
        data: {
          email,
          role: Role.USER,
          status: Status.PENDING,
          passwordHash,
        },
      });

      this.logger.log(`CREATE SUCCESS`);

      return user;
    } catch (error) {
      this.logger.error(`CREATE ERROR ${String(error)}`);
      throw new BadRequestException(error);
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User | null> {
    try {
      const prefix = `[EMAIL: ${authCredentialsDto.email}]`;
      this.logger.log(`VALIDATE_USER_BY_PASSWORD ${prefix} PENDING`);
      const { email, password } = authCredentialsDto;
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        this.logger.error(`VALIDATE_USER_BY_PASSWORD ${prefix} FAIL NOT_FOUND`);
        throw new NotFoundException();
      }
      const isPasswordValid = await this.comparePasswords(password, user.passwordHash);

      if (isPasswordValid) {
        this.logger.log(`VALIDATE_USER_BY_PASSWORD ${prefix} SUCCESS`);
        return user;
      } else {
        this.logger.error(`VALIDATE USER BY PASSWORD ${prefix} NO VALIDATE`);
        return null;
      }
    } catch (error) {
      this.logger.error(`VALIDATE_USER_BY_PASSWORD ${String(error)}`);
      throw new BadRequestException(error);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async getAll(): Promise<User[]> {
    try {
      this.logger.log(`FIND_ALL PENDING`);
      const result = await this.prisma.user.findMany();
      this.logger.log(`FIND_ALL SUCCESS`);

      return result;
    } catch (error) {
      this.logger.log(`FIND_ALL ERROR ${String(error)}`);
      throw new BadRequestException(error);
    }
  }

  async findById(id: number): Promise<User> {
    const prefix = `[USER ID: ${id}]`;
    try {
      const result = await this.prisma.user.findUnique({ where: { id } });

      if (!result) {
        this.logger.error(`FIND_ONE ${prefix} NOT FOUND`);
        throw new NotFoundException();
      }
      this.logger.log(`FIND_ONE ${prefix} SUCCESS`);
      return result;
    } catch (error) {
      this.logger.error(`FIND_ONE ${prefix} ${String(error)}`);
      throw new BadRequestException(error);
    }
  }

  async verifyUser(id: number): Promise<User> {
    const prefix = `[USER_ID: ${id}]`;
    try {
      this.logger.log(`VERIFY_USER ${prefix} PENDING`);

      const currentUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!currentUser) {
        this.logger.error(`VERIFY_USER ${prefix} FAIL NOT_FOUND`);
        throw new NotFoundException();
      }

      if (currentUser.status !== Status.PENDING) {
        this.logger.error(`VERIFY_USER ${prefix} INVALID STATUS`);
        throw new BadRequestException({
          message: 'Invalid status',
          code: 400,
        });
      }
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          status: Status.ACTIVE,
        },
      });
      this.logger.log(`VERIFY_USER ${prefix} SUCCESS`);

      return user;
    } catch (error) {
      this.logger.error(`VERIFY_USER ${prefix} ${String(error)}`);
      throw new BadRequestException(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    const prefix = `[USER_EMAIL: ${email}]`;
    try {
      this.logger.log(`FIND_BY_EMAIL ${prefix} PENDING`);
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        this.logger.error(`FIND_BY_EMAIL ${prefix} FAIL NOT_FOUND`);
        throw new NotFoundException();
      }

      this.logger.log(`FIND_BY_EMAIL ${prefix} SUCCESS`);
      return user;
    } catch (error) {
      this.logger.error(`FIND_BY_EMAIL ${prefix} ${String(error)}`);
      throw new BadRequestException(error);
    }
  }

  async isUserExistByEmail(email: string): Promise<boolean> {
    const prefix = `[USER_EMAIL: ${email}]`;
    try {
      this.logger.log(`IS_USER_EXIST_BY_EMAIL ${prefix} PENDING`);
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return !!user;
    } catch (error) {
      this.logger.error(`IS_USER_EXIST_BY_EMAIL ${prefix} ${String(error)}`);
      throw new BadRequestException(error);
    }
  }

  async updateUser(id: number, payload: UpdateUserDto) {
    const prefix = `[USER_ID: ${id}]`;
    try {
      const { email } = payload;
      this.logger.log(`UPDATE ${prefix} PENDING`);
      const user = await this.prisma.user.update({
        where: { id },
        data: { email },
      });
      this.logger.log(`UPDATE ${prefix} SUCCESS`);
      return user;
    } catch (error) {
      this.logger.error(`UPDATE ${prefix} ${String(error)}`);
      throw new BadRequestException(error);
    }
  }

  async deleteUser(id: number): Promise<void> {
    const prefix = `[USER_ID: ${id}]`;
    try {
      this.logger.log(`REMOVE ${prefix} PENDING`);

      const result = await this.prisma.user.delete({ where: { id } });
      if (!result) {
        this.logger.error(`REMOVE ${prefix} NOT FOUND`);
        throw new NotFoundException();
      }
      this.logger.log(`REMOVE ${prefix} SUCCESS`);
    } catch (error) {
      this.logger.error(`REMOVE ${prefix} ${String(error)}`);
      throw new BadRequestException(error);
    }
  }
}
