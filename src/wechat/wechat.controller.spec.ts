import { Test, TestingModule } from '@nestjs/testing';
import { WechatController } from './wechat.controller';
import { ConfigModule } from '../config/config.module';
import nock from 'nock';

describe('WechatController', () => {
  let wechatController: WechatController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [WechatController],
      providers: [],
    }).compile();

    wechatController = app.get<WechatController>(WechatController);
  });

  describe('mp-qr', () => {
    it('should getMediaPlatformTempQRImage', async () => {
      const scope = nock('https://api.weixin.qq.com');
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
        await wechatController.getMediaPlatformTempQRImage({
          query: {},
        } as any),
      ).toStrictEqual({
        expire_seconds: 60,
        ticket:
          'gQF27zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyNHZmZWtIb3JmazMxUkRUMjF1Y1IAAgQrd8JeAwQ8AAAA',
        url: 'http://weixin.qq.com/q/024vfekHorfk31RDT21ucR',
      });
    });
  });
});
