import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string;
}
