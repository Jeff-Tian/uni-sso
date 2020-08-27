import { Module } from '@nestjs/common';
import { WechatController } from './wechat.controller';
import { ConfigModule } from '../config/config.module';
import { WechatService } from './wechat.service';
import MemoryStorage from '@jeff-tian/memory-storage/src/MemoryStorage';
import QrScanStatus from './QrScanStatus';

@Module({
  imports: [ConfigModule],
  controllers: [WechatController],
  providers: [
    {
      provide: 'ICacheStorage',
      // TODO: use redis storage
      useClass: MemoryStorage,
    },
    {
      provide: 'QrScanStatus',
      useClass: QrScanStatus,
    },
    WechatService,
  ],
})
export class WechatModule {}
