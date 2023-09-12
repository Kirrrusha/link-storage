import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('tokens')
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  refreshToken: string;

  @Column()
  expireAt: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  userId: number;
}
