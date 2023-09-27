import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [TokenController],
  providers: [TokenRepository, TokenService, PrismaService],
  exports: [TokenService],
})
export class TokenModule {}
