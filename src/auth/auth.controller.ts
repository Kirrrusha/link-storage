import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Get,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshTokenDto } from '../token/dto/refresh-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('sign-up')
  signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  async signIp(
    @Body(new ValidationPipe()) authCredentialsDto: AuthCredentialsDto,
  ) {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('refresh-token')
  refreshTokens(@Body(new ValidationPipe()) payload: RefreshTokenDto) {
    // TODO взять bearer токен из header
    return this.authService.refreshTokens(payload);
  }

  @Get('confirm')
  @ApiImplicitQuery({
    name: 'confirm-token',
    required: true,
    type: String,
  })
  async verifyUser(@Query(new ValidationPipe()) params): Promise<UserEntity> {
    return this.authService.verifyUser(params['confirm-token']);
  }
}
