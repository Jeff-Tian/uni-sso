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

jest.mock('uuid');

describe('WechatController', () => {
  let wechatController: WechatController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule.forRoot({})],
      controllers: [WechatController],
      providers: [WechatService],
    }).compile();

    wechatController = app.get<WechatController>(WechatController);

    // @ts-ignore
    uuid.mockImplementation(() => '1234-5678');
  });

  describe('mp-qr', () => {
    it('should getMediaPlatformTempQRImage', async () => {
      // tslint:disable-next-line:no-console
      const scope = nock('https://api.weixin.qq.com').log(console.log);
      scope
        .get(
          /\/cgi\-bin\/token\?grant_type=client_credential&appid=[\w\d]+&secret=[\w\d]+/,
        )
        .reply(200, {});

      scope
        .post('/cgi-bin/qrcode/create?access_token=undefined', {
          expire_seconds: 60,
          action_name: 'QR_STR_SCENE',
          action_info: {
            scene: { scene_str: /\d\w\-+/ },
          },
        })
        .reply(200, {
          expire_seconds: 60,
          ticket:
            'gQF27zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyNHZmZWtIb3JmazMxUkRUMjF1Y1IAAgQrd8JeAwQ8AAAA',
          url: 'http://weixin.qq.com/q/024vfekHorfk31RDT21ucR',
        });

      expect(
        await wechatController.getMediaPlatformTempQRImageTicket({
          query: {},
        } as any),
      ).toStrictEqual({
        expire_seconds: 60,
        sceneId: '1234-5678',
        ticket:
          'gQF27zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyNHZmZWtIb3JmazMxUkRUMjF1Y1IAAgQrd8JeAwQ8AAAA',
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
    wechatService = new WechatService(configService, {
      // tslint:disable-next-line:no-console
      info: console.log,
    } as any);
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
