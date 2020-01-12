import { prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';

export class User {
    @IsString()
    @prop({ required: true })
    username: string;

    @IsString()
    @prop({})
    password: string;

    @prop()
    userId: number;

    @prop({ comment: '显示的名称' })
    displayName: string;
}

