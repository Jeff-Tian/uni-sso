import { Test, TestingModule } from '@nestjs/testing';
import { WechatController } from './wechat.controller';
import { ConfigModule } from '../config/config.module';
import nock from 'nock';
import { WechatService } from './wechat.service';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '../config/config.service';
import { Logger } from 'nestjs-pino/dist';
import { v4 as uuid } from 'uuid';
import MemoryStorage from '@jeff-tian/memory-storage/src/MemoryStorage';
import WechatNocked from '../../test/nocks/wechat';

jest.mock('uuid');

describe('WechatController', () => {
  let wechatController: WechatController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule.forRoot({})],
      controllers: [WechatController],
      providers: [
        {
          provide: 'ICacheStorage',
          useClass: MemoryStorage,
        },
        WechatService,
      ],
    }).compile();

    wechatController = app.get<WechatController>(WechatController);

    // @ts-ignore
    uuid.mockImplementation(() => '1234-5678');
  });

  describe('mp-qr', () => {
    it('should getMediaPlatformTempQRImage', async () => {
      WechatNocked.nockGetClientAccessToken('fake_token');
      const fakeTicket =
        'gQF27zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyNHZmZWtIb3JmazMxUkRUMjF1Y1IAAgQrd8JeAwQ8AAAA';
      WechatNocked.nockCreateTempQRTicket(fakeTicket);

      expect(
        await wechatController.getMediaPlatformTempQRImageTicket({
          query: {},
        } as any),
      ).toStrictEqual({
        expire_seconds: 60,
        sceneId: '1234-5678',
        ticket: fakeTicket,
        url: 'http://weixin.qq.com/q/024vfekHorfk31RDT21ucR',
      });
    });
  });
});

describe('pipes', () => {
  let configService: ConfigService;
  let wechatService: WechatService;
  let wechatController: WechatController;

  beforeEach(() => {
    configService = new ConfigService('/not/exists');
    wechatService = new WechatService(
      configService,
      {
        // tslint:disable-next-line:no-console
        info: console.log,
      } as any,
      {} as any,
    );
    wechatController = new WechatController(wechatService, {
      // tslint:disable-next-line:no-console
      log: console.log,
    } as Logger);
  });

  it('pipes image to response', async () => {
    jest
      .spyOn(wechatService, 'getMediaPlatformTempQRImageTicketResult')
      .mockImplementationOnce(async () => ({
        ticket: 'ticket',
      }));

    nock('https://mp.weixin.qq.com')
      .get('/cgi-bin/showqrcode?ticket=ticket')
      .reply(
        200,
        fs.createReadStream(path.resolve(__dirname, '../../models.svg')),
      );

    const bufferReceived = [];
    const logBuffer = bufferReceived.push.bind(bufferReceived);

    await wechatController.getMediaPlatformTempQRImage(
      {
        query: {},
      } as any,
      {
        on: (event: string, callback: () => void) => {
          // tslint:disable-next-line:no-console
          console.log('on ', event);

          callback();
        },
        once: logBuffer,
        emit: logBuffer,
        write: logBuffer,
        // tslint:disable-next-line:no-empty
        end: () => {},
        // tslint:disable-next-line:no-empty
        removeListener: (listener: () => void) => {},
        setHeader: (key: string, value: string) => {
          // tslint:disable-next-line:no-console
          console.log('setting ', key, ' to ', value);
        },
      } as any,
    );

    expect(bufferReceived.length).toBeGreaterThan(0);
  });
});
