import {Inject, Injectable} from '@nestjs/common';
import WechatAPI from 'co-wechat-api';
import {ConfigService} from '../config/config.service';
import {v4 as uuidv4} from 'uuid';
import * as util from 'util';
import {PinoLogger} from 'nestjs-pino/dist';
import ICacheStorage from '@jeff-tian/memory-storage/src/ICacheStorage';
import QrScanStatus from './QrScanStatus';
import {tryCatchProxy} from '@jeff-tian/failable';

export enum QR_SCAN_STATUS {
    NOT_SCANNED,
    SCANNED,
    TIMEOUT,
}

export const literal = (status: string) => QR_SCAN_STATUS[Number(status)];

const getTicketStatusKey = (ticket: string) => `QR-STATUS|${ticket}`;
const getTicketUserKey = (ticket: string) => `USER|${ticket}`;

@Injectable()
export class WechatService {
    private readonly wechatApi;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger,
        @Inject('ICacheStorage') private readonly cacheStorage: ICacheStorage,
        @Inject('QrScanStatus') private readonly qrScanStatus: QrScanStatus,
    ) {
        tryCatchProxy(WechatAPI, (error: Error) => {
            this.logger.error(error, error.message, {
                context: 'wechat.service.ts',
            });
        });

        this.wechatApi = new WechatAPI(
            this.configService.WECHAT_MP_APP_ID,
            this.configService.WECHAT_MP_APP_SECRET,
        );
    }

    async getMediaPlatformTempQRImageTicketResult(
        sceneId: string = uuidv4(),
        expiresInSeconds: number = 60,
    ) {
        this.logger.info(`getMediaPlatformTempQRImageTicketResult with ${sceneId}, ${expiresInSeconds}, config is ${util.inspect({
            appId: this.configService.WECHAT_MP_APP_ID,
            appSecret: this.configService.WECHAT_MP_APP_SECRET,
        })}`);

        const ticketResult = await this.wechatApi.createTmpQRCode(
            sceneId,
            expiresInSeconds,
        );

        this.logger.info(`ticketResult = ${util.inspect(ticketResult)}`);

        this.saveTicketStatus(ticketResult.ticket, expiresInSeconds * 1000).then();

        return {
            ...ticketResult,
            sceneId,
        };
    }

    async receiveQrScannedMessage(message: any) {
        this.logger.info(`received message: ${util.inspect(message)}`);

        const savingTicketUserOpenIdPromise = this.saveTicketUserOpenIdMapping(
            message.Ticket,
            2 * 60 * 1000,
            message.FromUserName,
        );

        const savingTicketStatusPromise = this.saveTicketStatus(
            message.Ticket,
            60 * 1000,
            QR_SCAN_STATUS.SCANNED,
        );

        await Promise.all([
            savingTicketUserOpenIdPromise,
            savingTicketStatusPromise,
        ]);

        this.qrScanStatus.emit(`qr-scanned-${message.Ticket}`);

        // const profile = await this.wechatApi.getUser({
        //   openid: message.FromUserName,
        //   lang: 'en',
        // });
        //
        // this.logger.info(`got user profile = ${util.inspect(profile)}`);
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

    private async saveTicketUserOpenIdMapping(
        ticket: string,
        clearAfter: number,
        openid: string,
    ) {
        await this.cacheStorage.save(getTicketUserKey(ticket), openid, clearAfter);
    }

    public async getTicketStatusListSize() {
        return this.cacheStorage.size;
    }

    /**
     * query QR Scan status
     *
     * @param ticket
     * @param timeoutInMilliSeconds
     *
     * TODO: Return ticket only, and for keycloak.jiwai.win to exchange openid by
     * ticket later
     */
    async getQRScanStatus(
        ticket: string,
        timeoutInMilliSeconds: number = 60 * 1000,
    ) {
        const status = await this.cacheStorage.get(getTicketStatusKey(ticket));

        if (status === QR_SCAN_STATUS.SCANNED.toString()) {
            const openId = await this.cacheStorage.get(getTicketUserKey(ticket));
            return {status: literal(status), openId};
        }

        return Promise.race([
            new Promise((resolve, reject) =>
                this.qrScanStatus.on(`qr-scanned-${ticket}`, async () => {
                    const openId = await this.cacheStorage.get(getTicketUserKey(ticket));

                    return resolve({
                        status: literal(QR_SCAN_STATUS.SCANNED.toString()),
                        openId,
                    });
                }),
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
