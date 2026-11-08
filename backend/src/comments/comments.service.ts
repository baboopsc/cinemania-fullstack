import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
  ) {}

  // Filme yeni yorum ekleme (kullanıcı yoksa 404 döner)
  async create(
    movieId: number,
    content: string,
    rating: number | null,
    userId: number,
  ): Promise<Comment> {
    const user = await this.usersService.findOne(userId);
    const newComment = this.commentsRepository.create({
      movieId,
      content,
      rating,
      user,
    });
    return await this.commentsRepository.save(newComment);
  }

  // Belirli bir filmin tüm yorumlarını getirme (kullanıcı bilgisiyle, en yeni önce)
  async findByMovieId(movieId: number): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { movieId },
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }
}
