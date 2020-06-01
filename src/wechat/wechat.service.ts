import { Inject, Injectable } from '@nestjs/common';
import WechatAPI from 'co-wechat-api';
import { ConfigService } from '../config/config.service';
import { v4 as uuidv4 } from 'uuid';
import * as util from 'util';
import { PinoLogger } from 'nestjs-pino/dist';
import ICacheStorage from '@jeff-tian/memory-storage/src/ICacheStorage';
import QrScanStatus from './QrScanStatus';

export enum QR_SCAN_STATUS {
  NOT_SCANNED,
  SCANNED,
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
    @Inject('QrScanStatus') private readonly qrScanStatus: QrScanStatus,
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

  async receiveQrScannedMessage(message: any) {
    this.logger.info(`received message: ${util.inspect(message)}`);

    this.qrScanStatus.emit(`qr-scanned-${message.Ticket}`);
    this.saveTicketStatus(
      message.Ticket,
      60 * 1000,
      QR_SCAN_STATUS.SCANNED,
    ).then();
  }

  private async saveTicketStatus(
    ticket: string,
    clearAfter: number,
    status = QR_SCAN_STATUS.NOT_SCANNED,
  ) {
    await this.cacheStorage.save(
      getTicketStatusKey(ticket),
      status.toString(),
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

    if (status === QR_SCAN_STATUS.SCANNED.toString()) {
      return literal(status);
    }

    return Promise.race([
      new Promise((resolve, reject) =>
        this.qrScanStatus.on(`qr-scanned-${ticket}`, () =>
          resolve(literal(QR_SCAN_STATUS.SCANNED.toString())),
        ),
      ),
      new Promise((resolve, reject) =>
        setTimeout(async () => {
          const statusAgain = await this.cacheStorage.get(
            getTicketStatusKey(ticket),
          );
          if (statusAgain === QR_SCAN_STATUS.SCANNED.toString()) {
            resolve(literal(statusAgain));
          } else {
            reject(new Error('timeout'));
            this.saveTicketStatus(
              ticket,
              60 * 1000,
              QR_SCAN_STATUS.TIMEOUT,
            ).then();
          }
        }, timeoutInMilliSeconds),
      ),
    ]);
  }
}
