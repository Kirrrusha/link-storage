import { UserEntity } from '../user/entities/user.entity';
import { ITokenResponse } from '../token/interfaces/token-payload.interface';

export interface SignResponse
  extends ITokenResponse, Pick<UserEntity, 'id' | 'email' | 'role' | 'status'> { }
