import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { User as UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAttribute } from './user-attribute.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    @InjectRepository(UserAttribute)
    private readonly userAttributesRepo: Repository<UserAttribute>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.find({ username });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepo.find();
  }

  async findAllUserAttributes(): Promise<UserAttribute[]> {
    return await this.userAttributesRepo.find();
  }

  async create(createUserDto: {
    username: string;
    password: string;
  }): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }
}
