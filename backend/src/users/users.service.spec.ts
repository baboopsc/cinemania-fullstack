import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const repo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn((data) => data),
    save: jest.fn(async (data) => ({ id: 1, ...data })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();
    service = moduleRef.get(UsersService);
  });

  it('creates a user when the email is new', async () => {
    repo.findOne.mockResolvedValue(null);
    const user = await service.create('ali', 'ali@example.com');
    expect(user).toEqual({ id: 1, username: 'ali', email: 'ali@example.com' });
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('rejects a duplicate email with 409 Conflict', async () => {
    repo.findOne.mockResolvedValue({ id: 5, email: 'ali@example.com' });
    await expect(service.create('ali', 'ali@example.com')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('throws 404 when a user does not exist', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(42)).rejects.toBeInstanceOf(NotFoundException);
  });
});
