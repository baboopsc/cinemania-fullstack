import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { buildDatabaseOptions } from './database.config';

@Module({
  imports: [
    // forRootAsync: ayarlar uygulama açılırken okunur (.env yüklendikten sonra)
    TypeOrmModule.forRootAsync({
      useFactory: () => buildDatabaseOptions(),
    }),
    UsersModule,
    CommentsModule,
  ],
})
export class AppModule {}
