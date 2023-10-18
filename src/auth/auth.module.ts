import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [ConfigModule, UserModule, MailModule, TokenModule, MailModule, PassportModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
