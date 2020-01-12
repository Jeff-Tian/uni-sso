import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getCats(): Promise<User[] | null> {
        return await this.usersService.findAll();
    }

    @Post()
    async create(@Body() user: User): Promise<User> {
        return await this.usersService.create(user);
    }
}
