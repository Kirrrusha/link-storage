import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

import {
  ITokenResponse,
} from '../token/interfaces/token-payload.interface';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { RefreshTokenDto } from '../token/dto/refresh-token.dto';
import dayjs from 'dayjs';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { StatusEnum } from '../user/enums/status.enum';

@Injectable()
export class AuthService {
  private readonly backendAppUrl: string;
  // private readonly maxSessionCount: number;

  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {
    this.backendAppUrl = this.configService.get<string>('BE_API_URL');
    // this.maxSessionCount = this.configService.get<number>('MAX_SESSION_COUNT');
  }

  async signUp(createUserDto: CreateUserDto): Promise<ITokenResponse> {
    try {
      const candidate = await this.userService.findByEmail(createUserDto.email);
      console.log('candidate', candidate);

      if (candidate) {
        throw new BadRequestException(
          `Пользователь с почтовым адресом ${createUserDto.email} уже существует`,
        );
      }

      const user = await this.userService.create(createUserDto);
      console.log('user', user);

      const tokens = await this.tokenService.createAuthTokens({
        userId: user.id,
        status: user.status,
        role: user.role,
      });
      console.log('tokens', tokens);

      // await this.sendConfirmation(user);
      return { ...tokens };
    } catch (e) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<ITokenResponse> {

    const candidate = await this.userService.findByEmail(authCredentialsDto.email);
    if (!candidate) {
      throw new BadRequestException(
        `Пользователь с почтовым адресом ${authCredentialsDto.email} не существует`,
      );
    }

    const user = await this.userService.validateUserPassword(
      authCredentialsDto,
    );

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

  async refreshTokens(payload: RefreshTokenDto): Promise<ITokenResponse> {
    const { expireAt, userId } = await this.tokenService.findRefreshToken(
      payload.refreshToken,
    );
    await this.tokenService.deleteRefreshToken(payload.refreshToken);
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

  async verifyUser(token: string): Promise<UserEntity> {
    const result = this.tokenService.decodeToken(token);
    // TODO добавить проверку Experi time больше суток
    return this.userService.verifyUser({
      id: result.id,
      status: result.status,
    });
  }

  async sendConfirmation(user: UserEntity) {
    const expiresIn = 60 * 60 * 24; // 24 hours
    const tokenPayload = {
      id: user.id,
      status: StatusEnum.pending,
    };

    const token = await this.tokenService.generateToken(tokenPayload, {
      expiresIn,
    });
    const confirmLink = `${this.backendAppUrl}/auth/confirm?token=${token}`;

    await this.mailService.send({
      from: this.configService.get<string>('JS_CODE_MAIL'),
      to: user.email,
      subject: 'Verify User',
      html: `
                <h3>Привет новый пользователь!</h3>
                <p>Пожалуйста используйте эту <a href="${confirmLink}">ссылку</a> для подтверждения аккаунта</p>
            `,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.deleteRefreshToken(refreshToken)
  }
}
