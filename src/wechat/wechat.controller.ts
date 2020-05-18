import { Controller, Get, Req, Res } from '@nestjs/common';
import WechatAPI from 'co-wechat-api';
import { ConfigService } from '../config/config.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('wechat')
export class WechatController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getMediaPlatformTempQRImage(@Req() request) {
    const wechatApi = new WechatAPI(
      this.configService.WECHAT_MP_APP_ID,
      this.configService.WECHAT_MP_APP_SECRET,
    );

    return await wechatApi.createTmpQRCode(
      request.query.sceneId ?? uuidv4(),
      request.query.expiresInSeconds ?? 60,
    );
  }
}
