import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Token } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { COMMON_EXCEPTION_ERROR } from '../constants/common.constants';
import { NOT_FOUND } from './token.constants';

@Injectable()
export class TokenRepository {
  private readonly logger = new Logger(TokenRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async createRefreshToken(userId: number): Promise<Token> {
    try {
      this.logger.log(`CREATE PENDING`);
      const data = await this.prisma.token.create({
        data: {
          expireAt: dayjs().add(30, 'day').toISOString(),
          refreshToken: uuidv4(),
          userId,
        },
      });

      this.logger.log(`CREATE SUCCESS`);

      return data;
    } catch (error) {
      this.logger.error(`CREATE ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async findRefreshToken(refreshToken: string): Promise<Token> {
    const prefix = `[REFRESH_TOKEN: ${refreshToken}]`;
    try {
      this.logger.log(`FIND_REFRESH_TOKEN_BY_EMAIL ${prefix} PENDING`);
      const token = await this.prisma.token.findUnique({ where: { refreshToken } });
      if (!token) {
        this.logger.error(`FIND_REFRESH_TOKEN_BY_EMAIL ${prefix} FAIL NOT_FOUND`);
        throw new NotFoundException();
      }
      return token;
    } catch (error) {
      this.logger.error(`FIND_REFRESH_TOKEN_BY_EMAIL ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async findByUserId(userId: number): Promise<Token[]> {
    const prefix = `[USER_ID: ${userId}]`;
    try {
      this.logger.log(`FIND_REFRESH_TOKEN_BY_USER_ID ${prefix} PENDING`);

      const token = await this.prisma.token.findMany({ where: { id: userId } });
      if (!token.length) {
        this.logger.error(`FIND_REFRESH_TOKEN_BY_USER_ID ${prefix} FAIL NOT_FOUND`);
        throw new NotFoundException();
      }
      return token;
    } catch (error) {
      this.logger.error(`FIND_REFRESH_TOKEN_BY_USER_ID ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async updateRefreshToken(id: number) {
    const prefix = `[REFRESH_TOKEN: ${id}]`;
    try {
      this.logger.log(`UPDATE_REFRESH_TOKEN ${prefix} PENDING`);
      const token = await this.prisma.token.update({
        where: { id },
        data: {
          expireAt: dayjs().add(60, 'day').toISOString(),
          refreshToken: uuidv4(),
        },
      });
      this.logger.log(`UPDATE_REFRESH_TOKEN ${prefix} SUCCESS`);
      return token;
    } catch (error) {
      this.logger.log(`UPDATE_REFRESH_TOKEN ERROR ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async getAll(): Promise<Token[]> {
    try {
      this.logger.log(`FIND_ALL PENDING`);
      const result = await this.prisma.token.findMany();
      this.logger.log(`FIND_ALL SUCCESS`);

      return result;
    } catch (error) {
      this.logger.log(`FIND_ALL ERROR ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async deleteToken(refreshToken: string): Promise<void> {
    const prefix = `[REFRESH_TOKEN: ${refreshToken}]`;
    try {
      this.logger.log(`REMOVE_BY_REFRESH_TOKEN ${prefix} PENDING`);

      const result = await this.prisma.token.delete({ where: { refreshToken } });
      if (!result) {
        this.logger.error(`REMOVE_BY_REFRESH_TOKEN ${prefix} NOT FOUND`);
        throw new NotFoundException(NOT_FOUND);
      }
      this.logger.log(`REMOVE_BY_REFRESH_TOKEN ${prefix} SUCCESS`);
    } catch (error) {
      this.logger.error(`REMOVE_BY_REFRESH_TOKEN ${prefix} ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async deleteById(id: number): Promise<void> {
    const prefix = `[TOKEN_ID: ${id}]`;
    try {
      this.logger.log(`REMOVE_BY_ID ${prefix} PENDING`);

      const result = await this.prisma.token.delete({ where: { id } });
      if (!result) {
        this.logger.error(`REMOVE_BY_ID ${prefix} NOT FOUND`);
        throw new NotFoundException();
      }
      this.logger.log(`REMOVE_BY_ID ${prefix} SUCCESS`);
    } catch (error) {
      this.logger.error(`REMOVE_BY_ID ${prefix} ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }

  async isExistToken(userId: number, refreshToken: string): Promise<boolean> {
    const prefix = `[USER_ID: ${userId}, REFRESH_TOKEN: ${refreshToken}]`;
    try {
      this.logger.log(`IS_EXIST_TOKEN ${prefix} PENDING`);

      const result = await this.prisma.token.findUnique({ where: { userId, refreshToken } });

      if (!result) {
        this.logger.error(`IS_EXIST_TOKEN ${prefix} NOT FOUND`);
        throw new NotFoundException(NOT_FOUND);
      }

      return !!result;
    } catch (error) {
      this.logger.error(`IS_EXIST_TOKEN ${prefix} ${String(error)}`);
      throw new InternalServerErrorException(COMMON_EXCEPTION_ERROR);
    }
  }
}
