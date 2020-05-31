import { Module } from '@nestjs/common';
import { WechatController } from './wechat.controller';
import { ConfigModule } from '../config/config.module';
import { WechatService } from './wechat.service';
import MemoryStorage from '@jeff-tian/memory-storage/src/MemoryStorage';
import ICacheStorage from '@jeff-tian/memory-storage/src/ICacheStorage';

@Module({
  imports: [ConfigModule],
  controllers: [WechatController],
  providers: [
    {
      provide: 'ICacheStorage',
      // TODO: use redis storage
      useClass: MemoryStorage,
    },
    WechatService,
  ],
})
export class WechatModule {}
