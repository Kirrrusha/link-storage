import { Body, Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('tokens')
@ApiTags('Tokens')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get()
  getAll() {
    return this.tokenService.getAll();
  }

  @Post()
  createToken(@Body() payload: CreateUserTokenDto) {
    return this.tokenService.createAuthTokens(payload);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.tokenService.deleteById(id);
  }
}
