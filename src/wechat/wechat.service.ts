import { Injectable } from '@nestjs/common';
import WechatAPI from 'co-wechat-api';
import { ConfigService } from '../config/config.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WechatService {
  constructor(private readonly configService: ConfigService) {}

  async getMediaPlatformTempQRImageTicketResult(
    sceneId: string = uuidv4(),
    expiresInSeconds: number = 60,
  ) {
    const wechatApi = new WechatAPI(
      this.configService.WECHAT_MP_APP_ID,
      this.configService.WECHAT_MP_APP_SECRET,
    );

    return await wechatApi.createTmpQRCode(sceneId, expiresInSeconds);
  }
}