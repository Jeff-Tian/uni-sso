import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.userModel.find({ username });
    }

    async findAll(): Promise<User[] | null> {
        return await this.userModel.find().exec();
    }

    async create(createUserDto: { username: string, password: string }): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }
}

