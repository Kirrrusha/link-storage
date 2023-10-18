import { Injectable, Logger } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { ITokenPayload, ITokenResponse } from './interfaces/token-payload.interface';
import { DecodeOptions, SignOptions } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

import { Token } from '@prisma/client';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(private tokenRepository: TokenRepository, private readonly jwtService: JwtService) {}

  async createAuthTokens(payload: CreateUserTokenDto): Promise<ITokenResponse> {
    const expiresIn = 60 * 60 * 0.5; // 0.5 hours
    const tokenPayload = {
      id: payload.userId,
      status: payload.status,
      role: payload.role,
    };

    const accessToken = this.generateToken(tokenPayload, { expiresIn });
    const data = await this.tokenRepository.createRefreshToken(payload.userId);

    return {
      refreshToken: data.refreshToken,
      accessToken,
    };
  }

  async getAll(): Promise<Token[]> {
    return this.tokenRepository.getAll();
  }

  generateToken(data: ITokenPayload, options?: SignOptions): string {
    try {
      const token = this.jwtService.sign(data, options);
      return token;
    } catch (error) {
      this.logger.error(`Error generating token: ${String(error)}`);
      throw new Error('Failed to generate token');
    }
  }

  decodeToken(token: string, options?: DecodeOptions): ITokenPayload {
    const data = this.jwtService.decode(token, options);
    return data as ITokenPayload;
  }

  async deleteById(id: number): Promise<void> {
    return this.tokenRepository.deleteById(id);
  }
  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.deleteToken(refreshToken);
  }

  async findRefreshToken(refreshToken: string): Promise<Token> {
    return this.tokenRepository.findRefreshToken(refreshToken);
  }

  async validateToken(token: string, deltaTime = 0): Promise<boolean> {
    try {
      const decodedToken = this.jwtService.verify(token);
      if (!decodedToken || !decodedToken.exp) {
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpireTime = decodedToken.exp;

      return tokenExpireTime > currentTime + deltaTime; // Проверка срока действия
    } catch (error) {
      return false; // Ошибка при декодировании токена
    }
  }
}
