import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshTokenDto } from '../token/dto/refresh-token.dto';
import { UserEntity } from '../user/entities/user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto): Promise<import("../token/interfaces/token-payload.interface").ITokenResponse>;
    signIp(authCredentialsDto: AuthCredentialsDto): Promise<import("../token/interfaces/token-payload.interface").ITokenResponse>;
    refreshTokens(payload: RefreshTokenDto): Promise<import("../token/interfaces/token-payload.interface").ITokenResponse>;
    verifyUser(params: any): Promise<UserEntity>;
}
