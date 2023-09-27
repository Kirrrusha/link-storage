import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

import { ITokenResponse } from '../token/interfaces/token-payload.interface';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { RefreshTokenDto } from '../token/dto/refresh-token.dto';
import dayjs from 'dayjs';
import { UserService } from '../user/user.service';
import { Status, User } from '@prisma/client';
import { COMMON_EXCEPTION_ERROR } from '../constants/common.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly backendAppUrl: string;
  private readonly expiresInConfirmToken = 60 * 60 * 24; // 24 hours
  // private readonly maxSessionCount: number;

  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {
    this.backendAppUrl = this.configService.get<string>('BE_API_URL', 'http://localhost:3030');
    // this.maxSessionCount = this.configService.get<number>('MAX_SESSION_COUNT');
  }

  async signUp(createUserDto: CreateUserDto): Promise<ITokenResponse> {
    this.logger.log('SIGN_UP PENDING');
    const candidate = await this.userService.findByEmail(createUserDto.email);

    if (candidate) {
      this.logger.error('SIGN_UP USER WITH THIS EMAIL EXIST');
      throw new BadRequestException(`Пользователь с почтовым адресом ${createUserDto.email} уже существует`);
    }

    const user = await this.userService.create(createUserDto);

    const tokens = await this.tokenService.createAuthTokens({
      userId: user.id,
      status: user.status,
      role: user.role,
    });

    this.logger.log('SIGN_UP SUCCESS');

    // await this.sendConfirmation(user);
    return { ...tokens };
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

    // TODO логика по ограничению количества сессий
    // const allActiveTokens = await this.tokenRepository.findByUserId(user.id);

    // if (allActiveTokens.length > this.maxSessionCount) {
    //   this.logout();
    // }

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
    const tokenPayload = {
      id: user.id,
      status: Status.PENDING,
    };

    const token = await this.tokenService.generateToken(tokenPayload, {
      expiresIn: this.expiresInConfirmToken,
    });
    const confirmLink = `${this.backendAppUrl}/auth/confirm?token=${token}`;

    await this.mailService.send({
      from: this.configService.get<string>('MAIL_FROM', 'sender@example.com'),
      to: user.email,
      subject: 'Verify User',
      html: `
                <h3>Привет новый пользователь!</h3>
                <p>Пожалуйста используйте эту <a href="${confirmLink}">ссылку</a> для подтверждения аккаунта</p>
            `,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.deleteRefreshToken(refreshToken);
  }
}
