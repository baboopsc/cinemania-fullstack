import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number; // TMDB API'den gelen film ID'si

  @Column('text')
  content: string;

  // 'float': PostgreSQL'de de sayı olarak döner ('numeric' metin döndürürdü)
  @Column({ type: 'float', nullable: true })
  rating: number | null; // Filme verilen yıldız puanı (0-10)

  @CreateDateColumn()
  createdAt: Date;

  // Bir yorumun tek bir kullanıcısı olur
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;
}
