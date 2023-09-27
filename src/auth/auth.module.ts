import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';

@Module({
  imports: [JwtAuthModule, ConfigModule, UserModule, PassportModule, MailModule, TokenModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
