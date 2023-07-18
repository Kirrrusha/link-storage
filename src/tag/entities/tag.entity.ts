import { ArticleEntity } from '../../article/entities/article.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string;

  @ManyToMany(() => ArticleEntity, (article) => article.tags, {
    eager: false,
  })
  articles: ArticleEntity[];
}
