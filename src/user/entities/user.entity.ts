import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import bcrypt from 'bcrypt';
import { RoleEnum } from '../enums/role.enum';
import { StatusEnum } from '../enums/status.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: RoleEnum.user })
  role: RoleEnum.admin | RoleEnum.user;

  @Column()
  status: StatusEnum.pending | StatusEnum.blocked | StatusEnum.active;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
