import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './user.model';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as UserEntity } from './user.entity';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
