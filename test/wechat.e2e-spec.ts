import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { sleep } from '@jeff-tian/sleep';

jest.setTimeout(10000);
describe('WechatController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // https://github.com/visionmedia/supertest/issues/520#issuecomment-579291801
  // For eliminate the testing hang up
  afterAll(async () => {
    await sleep(500);
  });

  it('/wechat/mp-qr-image (GET)', async () => {
    return request(app.getHttpServer())
      .get('/wechat/mp-qr-image')
      .expect(200)
      .end();
  });
});
