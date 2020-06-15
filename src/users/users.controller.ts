import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './user.model';
import { User as UserEntity } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.usersService.create(user);
  }
}
