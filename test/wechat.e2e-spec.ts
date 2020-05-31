import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { sleep } from '@jeff-tian/sleep';
import { v4 as uuid } from 'uuid';
import WechatNocked from './nocks/wechat';

jest.mock('uuid');

jest.setTimeout(10000);
describe('WechatController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // @ts-ignore
    uuid.mockImplementation(() => '1234');
  });

  afterEach(async () => {
    await app.close();
  });

  // https://github.com/visionmedia/supertest/issues/520#issuecomment-579291801
  // For eliminate the testing hang up
  afterAll(async () => {
    await sleep(500);
  });

  it('/wechat/mp-qr-image (GET) with x-scene-id header and ticket header', async () => {
    const fakeTicket =
      'gQG17zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAydzRBT2swb3JmazMxVlpwanh1Y2cAAgRBmdNeAwQ8AAAA';

    WechatNocked.nockGetClientAccessToken('fake_token');

    WechatNocked.nockCreateTempQRTicket(fakeTicket);

    await request(app.getHttpServer())
      .get('/wechat/mp-qr-image')
      .expect(200)
      .expect('x-scene-id', '1234')
      .expect('x-ticket', fakeTicket);

    await request(app.getHttpServer())
      .get('/wechat/mp-qr-scenes/count')
      .expect(200, { count: 1 });
  });
});
