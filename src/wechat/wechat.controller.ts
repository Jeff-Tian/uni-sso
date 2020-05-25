import { Controller, Get, Req, Res } from '@nestjs/common';
import { WechatService } from './wechat.service';
// tslint:disable-next-line:no-var-requires
const axios = require('axios').default;

@Controller('wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  @Get('/mp-qr-ticket')
  async getMediaPlatformTempQRImageTicket(@Req() request) {
    return await this.wechatService.getMediaPlatformTempQRImageTicketResult(
      request.query.sceneId,
      request.query.expiresInSeconds,
    );
  }

  @Get('/mp-qr-url')
  async getMediaPlatformTempQRImageUrl(@Req() request) {
    const ticketResult = await this.wechatService.getMediaPlatformTempQRImageTicketResult(
      request.query.sceneId,
      request.query.expiresInSeconds,
    );

    return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticketResult.ticket}`;
  }

  @Get('/mp-qr-image')
  async getMediaPlatformTempQRImage(@Req() request) {
    const url = await this.getMediaPlatformTempQRImageUrl(request);
    return await axios.get(url);
  }
}
