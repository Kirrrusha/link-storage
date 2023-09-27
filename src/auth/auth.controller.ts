import { Body, Controller, Post, ValidationPipe, Get, Query, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshTokenDto } from '../token/dto/refresh-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  async signIp(@Body(new ValidationPipe()) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('refresh-token')
  refreshTokens(@Req() request: Request) {
    const refreshToken = request.cookies['auth-refresh-token'];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    return this.authService.updateRefreshTokens(refreshToken);
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
}
