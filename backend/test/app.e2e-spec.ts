import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { CommentsModule } from '../src/comments/comments.module';
import { buildDatabaseOptions } from '../src/database.config';

/**
 * Uçtan uca API testleri.
 * - DATABASE_URL yoksa: bellek içi SQLite (kurulum gerekmez)
 * - DATABASE_URL varsa (CI'daki PostgreSQL servisi): gerçek PostgreSQL
 * Her çalıştırmada şema sıfırlanır (dropSchema), bu yüzden canlı veritabanı
 * adresiyle ÇALIŞTIRMAYIN.
 */
describe('Cinemania API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const dbOptions = {
      ...buildDatabaseOptions({ ...process.env, SQLITE_PATH: ':memory:' }),
      dropSchema: true,
    } as TypeOrmModuleOptions;

    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dbOptions), UsersModule, CommentsModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let userId: number;

  it('POST /users creates a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'ali', email: 'Ali@Example.com' })
      .expect(201);

    expect(res.body).toMatchObject({ username: 'ali', email: 'ali@example.com' });
    userId = res.body.id;
  });

  it('POST /users rejects a duplicate email (409)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'ali2', email: 'ali@example.com' })
      .expect(409);
  });

  it('POST /users rejects an invalid email (400)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'x', email: 'nope' })
      .expect(400);
  });

  it('GET /users/:id returns 404 for a missing user', async () => {
    await request(app.getHttpServer()).get('/users/9999').expect(404);
  });

  it('POST /comments adds a comment to a movie', async () => {
    const res = await request(app.getHttpServer())
      .post('/comments')
      .send({ movieId: 550, content: 'Great movie', rating: 8.5, userId })
      .expect(201);

    expect(res.body).toMatchObject({ movieId: 550, content: 'Great movie', rating: 8.5 });
  });

  it('POST /comments rejects a comment from an unknown user (404)', async () => {
    await request(app.getHttpServer())
      .post('/comments')
      .send({ movieId: 550, content: 'Hi', userId: 9999 })
      .expect(404);
  });

  it('POST /comments rejects empty content (400)', async () => {
    await request(app.getHttpServer())
      .post('/comments')
      .send({ movieId: 550, content: '   ', userId })
      .expect(400);
  });

  it('GET /comments/:movieId lists the movie comments with the author', async () => {
    const res = await request(app.getHttpServer()).get('/comments/550').expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].user).toMatchObject({ id: userId, username: 'ali' });
  });

  it('GET /comments/:movieId rejects a non-numeric id (400)', async () => {
    await request(app.getHttpServer()).get('/comments/abc').expect(400);
  });
});
