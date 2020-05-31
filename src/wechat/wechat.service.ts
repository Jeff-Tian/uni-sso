import { Inject, Injectable } from '@nestjs/common';
import WechatAPI from 'co-wechat-api';
import { ConfigService } from '../config/config.service';
import { v4 as uuidv4 } from 'uuid';
import * as util from 'util';
import { PinoLogger } from 'nestjs-pino/dist';
import ICacheStorage from '@jeff-tian/memory-storage/src/ICacheStorage';

export enum QR_SCAN_STATUS {
  NOT_SCANNED = '0',
  SCANNED = '1',
  ERROR = '2',
}

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

    this.saveSceneStatus(sceneId, expiresInSeconds * 1000).then();

    return {
      ...(await wechatApi.createTmpQRCode(sceneId, expiresInSeconds)),
      sceneId,
    };
  }

  async receiveQrScannedMessage(request: any) {
    return this.logger.info(`received message: ${util.inspect(request)}`);
  }

  private async saveSceneStatus(sceneId: string, clearAfter: number) {
    await this.cacheStorage.save(
      `QR-STATUS|${sceneId}`,
      QR_SCAN_STATUS.NOT_SCANNED,
      clearAfter,
    );
  }

  public async getSceneStatusList() {
    return this.cacheStorage.size;
  }
}
