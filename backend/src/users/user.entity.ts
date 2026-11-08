import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comment } from '../comments/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  // Bir kullanıcının birden çok yorumu olabilir
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}