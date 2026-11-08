import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  optionalRating,
  requirePositiveInt,
  requireString,
} from '../validation';

@Controller('comments') // API uzantımız: localhost:3000/comments
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Filme yeni yorum atma: POST /comments
  @Post()
  async createComment(
    @Body()
    body: {
      movieId?: unknown;
      content?: unknown;
      rating?: unknown;
      userId?: unknown;
    },
  ) {
    const movieId = requirePositiveInt(body?.movieId, 'movieId');
    const content = requireString(body?.content, 'content', 1000);
    const rating = optionalRating(body?.rating);
    const userId = requirePositiveInt(body?.userId, 'userId');
    return await this.commentsService.create(movieId, content, rating, userId);
  }

  // Filmin yorumlarını getirme: GET /comments/:movieId
  @Get(':movieId')
  async getCommentsByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return await this.commentsService.findByMovieId(movieId);
  }
}
