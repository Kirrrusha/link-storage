import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

import { ITokenResponse } from '../token/interfaces/token-payload.interface';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import * as dayjs from 'dayjs';
import { UserService } from '../user/user.service';
import { Status, User } from '@prisma/client';
import { COMMON_EXCEPTION_ERROR } from '../constants/common.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly backendAppUrl: string;
  private readonly expiresInConfirmToken = 60 * 60 * 24; // 24 hours

  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {
    this.backendAppUrl = this.configService.get<string>('BE_API_URL', 'http://localhost:3030');
  }

  async signUp(createUserDto: CreateUserDto): Promise<ITokenResponse> {
    try {
      this.logger.log('SIGN_UP PENDING');
      const isExistUser = await this.userService.isUserExistByEmail(createUserDto.email);

      if (isExistUser) {
        this.logger.error('SIGN_UP USER WITH THIS EMAIL EXIST');
        throw new BadRequestException(`Пользователь с почтовым адресом ${createUserDto.email} уже существует`);
      }

      const user = await this.userService.create(createUserDto);

      const tokens = await this.tokenService.createAuthTokens({
        userId: user.id,
        status: user.status,
        role: user.role,
      });
      this.sendConfirmation(user);

      this.logger.log('SIGN_UP SUCCESS');
      return tokens;
    } catch (error) {
      this.logger.error(`SIGN_UP ERROR ${String(error)}`);
      throw new BadRequestException(error);
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<ITokenResponse> {
    const candidate = await this.userService.findByEmail(authCredentialsDto.email);
    if (!candidate) {
      throw new BadRequestException(`Пользователь с почтовым адресом ${authCredentialsDto.email} не существует`);
    }

    const user = await this.userService.validateUserPassword(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Невалидный email или пароль');
    }

    const authTokens = await this.tokenService.createAuthTokens({
      userId: user.id,
      status: user.status,
      role: user.role,
    });

    return authTokens;
  }

  async updateRefreshTokens(refreshToken: string): Promise<ITokenResponse> {
    const { expireAt, userId } = await this.tokenService.findRefreshToken(refreshToken);
    await this.tokenService.deleteRefreshToken(refreshToken);
    if (!dayjs().isAfter(expireAt)) {
      new UnauthorizedException('TOKEN_EXPIRED');
    }

    const user = await this.userService.findById(userId);

    const tokens = await this.tokenService.createAuthTokens({
      userId: userId,
      status: user.status,
      role: user.role,
    });

    return tokens;
  }

  async verifyUser(token: string): Promise<User> {
    const isValid = this.tokenService.validateToken(token, this.expiresInConfirmToken);
    if (!isValid) {
      throw new UnauthorizedException('Не валидный токен');
    }
    const result = this.tokenService.decodeToken(token);

    return this.userService.verifyUser(result.id);
  }

  async sendConfirmation(user: User) {
    try {
      const tokenPayload = {
        id: user.id,
        status: Status.PENDING,
      };

      const token = this.tokenService.generateToken(tokenPayload, {
        expiresIn: this.expiresInConfirmToken,
      });
      const confirmLink = `${this.backendAppUrl}/auth/confirm?token=${token}`;

      this.mailService.sendConfirmMail({
        id: user.id,
        email: user.email,
        confirmLink,
      });
    } catch (error) {
      this.logger.error(`MAIL DID NOT SEND ${String(error)}`);
      throw new BadRequestException(`Письмо не отправлено`);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.deleteRefreshToken(refreshToken);
  }
}
