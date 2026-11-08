import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { requireEmail, requireString } from '../validation';

@Controller('users') // API uzantımız: localhost:3000/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Yeni kullanıcı oluşturma: POST /users
  @Post()
  async createUser(@Body() body: { username?: unknown; email?: unknown }) {
    const username = requireString(body?.username, 'username', 50);
    const email = requireEmail(body?.email);
    return await this.usersService.create(username, email);
  }

  // Tüm kullanıcıları listeleme: GET /users
  @Get()
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  // Tek kullanıcı: GET /users/:id
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }
}
