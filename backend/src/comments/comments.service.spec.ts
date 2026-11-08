import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { UsersService } from '../users/users.service';

describe('CommentsService', () => {
  let service: CommentsService;
  const repo = {
    find: jest.fn(),
    create: jest.fn((data) => data),
    save: jest.fn(async (data) => ({ id: 10, ...data })),
  };
  const usersService = { findOne: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: repo },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();
    service = moduleRef.get(CommentsService);
  });

  it('saves a comment for an existing user', async () => {
    const user = { id: 1, username: 'ali', email: 'ali@example.com' };
    usersService.findOne.mockResolvedValue(user);
    const comment = await service.create(550, 'Great movie', 8.5, 1);
    expect(comment).toMatchObject({ id: 10, movieId: 550, rating: 8.5, user });
  });

  it('does not save a comment when the user is missing', async () => {
    usersService.findOne.mockRejectedValue(new NotFoundException());
    await expect(service.create(550, 'Hi', null, 99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('lists comments for one movie, newest first', async () => {
    repo.find.mockResolvedValue([]);
    await service.findByMovieId(550);
    expect(repo.find).toHaveBeenCalledWith({
      where: { movieId: 550 },
      relations: ['user'],
      order: { id: 'DESC' },
    });
  });
});
