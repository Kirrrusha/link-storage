import { Body, Controller, Post, ValidationPipe, Get, Query, Req, UnauthorizedException, Res, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private cookieName;
  private expires;
  constructor(private authService: AuthService, private readonly configService: ConfigService) {
    this.cookieName = this.configService.get('AUTH_COOKIE_NAME');

    this.expires = new Date(
      dayjs()
        .add(Number(this.configService.get('EXPIRES_IN_DAYS')), 'day')
        .format(),
    );
  }

  @Post('sign-up')
  async signUp(@Res() res: Response, @Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const { refreshToken, accessToken } = await this.authService.signUp(createUserDto);

    res.cookie(this.cookieName, refreshToken, {
      httpOnly: true,
      secure: true,
      expires: this.expires,
      // domain: '.example.com', // Кука доступна для всех поддоменов example.com
    });
    return res.send({ accessToken });
  }

  @Post('sign-in')
  async signIn(@Res() res: Response, @Body(new ValidationPipe()) authCredentialsDto: AuthCredentialsDto) {
    const { refreshToken, accessToken } = await this.authService.signIn(authCredentialsDto);

    res.cookie(this.cookieName, refreshToken, {
      httpOnly: true,
      secure: true,
      expires: this.expires,
      // domain: '.example.com', // Кука доступна для всех поддоменов example.com
    });
    res.status(HttpStatus.OK).send({ accessToken });
  }

  @Post('refresh-token')
  async refreshTokens(@Req() request: Request, res: Response) {
    const refreshToken = request.cookies[this.cookieName];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.updateRefreshTokens(refreshToken);
    res.cookie(this.cookieName, tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: this.expires,
      // domain: '.example.com', // Кука доступна для всех поддоменов example.com
    });
    return res.send('ok');
  }

  @Get('confirm')
  @ApiImplicitQuery({
    name: 'confirm-token',
    required: true,
    type: String,
  })
  async verifyUser(@Query(new ValidationPipe()) params: { 'confirm-token': string }): Promise<User> {
    return this.authService.verifyUser(params['confirm-token']);
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['auth-refresh-token'];
    res.clearCookie('auth-refresh-token');
    await this.authService.logout(refreshToken);
    res.send();
  }
}
