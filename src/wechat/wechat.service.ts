import { Inject, Injectable } from '@nestjs/common';
import WechatAPI from 'co-wechat-api';
import { ConfigService } from '../config/config.service';
import { v4 as uuidv4 } from 'uuid';
import * as util from 'util';
import { PinoLogger } from 'nestjs-pino/dist';
import ICacheStorage from '@jeff-tian/memory-storage/src/ICacheStorage';
import { sleep } from '@jeff-tian/sleep';

export enum QR_SCAN_STATUS {
  NOT_SCANNED,
  SCANNED,
  ERROR,
  TIMEOUT,
}

export const literal = (status: string) => QR_SCAN_STATUS[Number(status)];

const getTicketStatusKey = (ticket: string) => `QR-STATUS|${ticket}`;

@Injectable()
export class WechatService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
    @Inject('ICacheStorage') private readonly cacheStorage: ICacheStorage,
  ) {}

  async getMediaPlatformTempQRImageTicketResult(
    sceneId: string = uuidv4(),
    expiresInSeconds: number = 60,
  ) {
    const wechatApi = new WechatAPI(
      this.configService.WECHAT_MP_APP_ID,
      this.configService.WECHAT_MP_APP_SECRET,
    );

    const ticketResult = await wechatApi.createTmpQRCode(
      sceneId,
      expiresInSeconds,
    );

    this.saveTicketStatus(ticketResult.ticket, expiresInSeconds * 1000).then();

    return {
      ...ticketResult,
      sceneId,
    };
  }

  async receiveQrScannedMessage(request: any) {
    return this.logger.info(`received message: ${util.inspect(request)}`);
  }

  private async saveTicketStatus(ticket: string, clearAfter: number) {
    await this.cacheStorage.save(
      getTicketStatusKey(ticket),
      QR_SCAN_STATUS.NOT_SCANNED.toString(),
      clearAfter,
    );
  }

  public async getTicketStatusListSize() {
    return this.cacheStorage.size;
  }

  async getQRScanStatus(
    ticket: string,
    timeoutInMilliSeconds: number = 60 * 1000,
  ) {
    const status = await this.cacheStorage.get(getTicketStatusKey(ticket));

    if (
      status === QR_SCAN_STATUS.SCANNED.toString() ||
      status === QR_SCAN_STATUS.ERROR.toString()
    ) {
      return literal(status);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('timeout')), timeoutInMilliSeconds);
    });
  }
}
