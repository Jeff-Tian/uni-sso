import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { WechatService } from './wechat.service';
import { Logger } from 'nestjs-pino';
import * as util from 'util';
// tslint:disable-next-line:no-var-requires
const axios = require('axios').default;

@Controller('wechat')
export class WechatController {
  constructor(
    private readonly wechatService: WechatService,
    private readonly logger: Logger,
  ) {}

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

    return {
      imageUrl: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticketResult.ticket}`,
      ...ticketResult,
    };
  }

  @Get('/mp-qr-image')
  async getMediaPlatformTempQRImage(@Req() request, @Res() response) {
    const {
      imageUrl: url,
      sceneId,
      ticket,
    } = await this.getMediaPlatformTempQRImageUrl(request);
    const axiosResponse = await axios.get(url, { responseType: 'stream' });

    response.setHeader('x-scene-id', sceneId);
    response.setHeader('x-ticket', ticket);

    return axiosResponse.data.pipe(response);
  }

  @Get('/mp-qr-scan-status')
  async receivedQrScannedMessage(@Req() request) {
    if (!request.query.ticket) {
      throw new HttpException(
        'Ticket must have a value!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return {
      status: await this.wechatService.getQRScanStatus(request.query.ticket),
      // TODO: Return ticket only, and for keycloak.jiwai.win to exchange openid by ticket later
      openid: ''
    };
  }

  @Post('/mp-qr-scanned')
  async receivedQrScannedPostMessage(@Req() request) {
    this.logger.log(`Recevied message: ${util.inspect(request.body)}`, 'mp', [
      {
        body: request.body,
      },
    ]);

    this.wechatService.receiveQrScannedMessage(request.body.xml).then();

    return 'Noticed, thank you!';
  }

  @Get('/mp-qr-scenes/count')
  async getQrScenesCount() {
    return { count: await this.wechatService.getTicketStatusListSize() };
  }
}
