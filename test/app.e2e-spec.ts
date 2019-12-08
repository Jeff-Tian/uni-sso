import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
      .expect(201).expect(/access_token/);

    expect(res.body.access_token).toBeDefined();

    const { body: profile } = await request(app.getHttpServer())
      .get('/profile').set('Authorization', `Bearer ${res.body.access_token}`).expect(200);

    expect(profile).toStrictEqual({ userId: 1, username: 'john' });
  });
});
