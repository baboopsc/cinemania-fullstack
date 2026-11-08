import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // User tablosunu bağladık
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Yorumlar modülü kullanıcı kontrolü için kullanıyor
})
export class UsersModule {}
