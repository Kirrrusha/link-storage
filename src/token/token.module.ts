import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { TokenRepository } from './token.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([TokenEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [TokenController],
  providers: [TokenRepository, TokenService, JwtStrategy],
  exports: [TokenService]
})
export class TokenModule { }
