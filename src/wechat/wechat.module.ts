import { Module } from '@nestjs/common';
import { WechatController } from './wechat.controller';
import { ConfigModule } from '../config/config.module';
import { WechatService } from './wechat.service';
import QrScanStatus from './QrScanStatus';
import RedisStorage from "../storages/redis.storage";

@Module({
  imports: [ConfigModule],
  controllers: [WechatController],
  providers: [
    {
      provide: 'ICacheStorage',
      // TODO: use redis storage
      useClass: RedisStorage,
    },
    {
      provide: 'QrScanStatus',
      useClass: QrScanStatus,
    },
    WechatService,
  ],
})
export class WechatModule {}
