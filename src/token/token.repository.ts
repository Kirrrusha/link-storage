import { Repository, DeleteResult, DataSource } from 'typeorm';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { TokenEntity } from './entities/token.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenRepository extends Repository<TokenEntity> {
  constructor(private dataSource: DataSource) {
    super(TokenEntity, dataSource.createEntityManager());
  }

  async createRefreshToken(userId: number): Promise<TokenEntity> {
    try {
      const data = await this.save({
        expireAt: dayjs().add(60, 'day').toISOString(),
        refreshToken: uuidv4(),
        userId,
      });
      return data
    } catch (error) {
      console.error('createRefreshToken', error)
    }
  }

  async findRefreshToken(refreshToken: string): Promise<TokenEntity> {
    return this.findOne({ where: { refreshToken } });
  }

  async findByUserId(userId: number): Promise<TokenEntity[]> {
    return this.find({ where: { id: userId } });
  }

  async updateRefreshToken(id: number) {
    return this.save({
      id,
      expireAt: dayjs().add(60, 'day').toISOString(),
      refreshToken: uuidv4(),
    });
  }

  async getAll(): Promise<TokenEntity[]> {
    return await this.find();
  }

  async deleteToken(refreshToken: string): Promise<DeleteResult> {
    return this.delete({ refreshToken });
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.delete(id);
  }

  async isExistToken(userId: number, refreshToken: string): Promise<boolean> {
    const result = await this.findOne({ where: { userId, refreshToken } });
    return !!result;
  }
}
