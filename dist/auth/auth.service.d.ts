import { ConfigService } from '@nestjs/config';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ITokenResponse } from '../token/interfaces/token-payload.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { RefreshTokenDto } from '../token/dto/refresh-token.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private userService;
    private readonly configService;
    private tokenService;
    private mailService;
    private readonly backendAppUrl;
    constructor(userService: UserService, configService: ConfigService, tokenService: TokenService, mailService: MailService);
    signUp(createUserDto: CreateUserDto): Promise<ITokenResponse>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<ITokenResponse>;
    refreshTokens(payload: RefreshTokenDto): Promise<ITokenResponse>;
    verifyUser(token: string): Promise<UserEntity>;
    sendConfirmation(user: UserEntity): Promise<void>;
    logout(refreshToken: string): Promise<void>;
}
