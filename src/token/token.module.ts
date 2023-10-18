import { Module } from '@nestjs/common';

import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('SECRET_KEY'),
          signOptions: {
            expiresIn: configService.get('EXPIRES_IN_DAYS') + 'd',
          },
        };
      },
    }),
  ],
  providers: [TokenRepository, TokenService, PrismaService],
  exports: [TokenService],
})
export class TokenModule {}
