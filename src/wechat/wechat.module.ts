import { Module } from '@nestjs/common';
import { WechatController } from './wechat.controller';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [WechatController],
})
export class WechatModule {}
