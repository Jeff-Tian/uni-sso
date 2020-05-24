import { Module } from '@nestjs/common';
import { WechatController } from './wechat.controller';
import { ConfigModule } from '../config/config.module';
import { WechatService } from './wechat.service';

@Module({
  imports: [ConfigModule],
  controllers: [WechatController],
  providers: [WechatService],
})
export class WechatModule {}
