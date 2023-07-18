import { TagEntity } from '../../tag/entities/tag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, unique: true })
  url: string;

  @Column({ type: 'varchar' })
  content: string;

  @ManyToMany(() => TagEntity, (tag) => tag.articles, {
    cascade: true,
    eager: false,
  })
  @JoinTable()
  tags: TagEntity[];
}
