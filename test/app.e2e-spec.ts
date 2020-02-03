import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { sleep } from '@jeff-tian/sleep';

jest.setTimeout(10000);

describe('AppController (e2e)', () => {
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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/login (POST) and /profile (GET)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'john', password: 'changeme' })
      .expect(201)
      .expect(/access_token/);

    expect(res.body.access_token).toBeDefined();

    const { body: profile } = await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${res.body.access_token}`)
      .expect(200);

    expect(profile).toStrictEqual({ userId: 1, username: 'john' });
  });

  it('allows options request for /auth/login', async () => {
    const { body } = await request(app.getHttpServer())
      .options('/auth/login')
      .expect(204)
      .expect('');

    expect(body).toEqual({});
  });
});
