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

  it('/profile (GET) failed without access_token', async () => {
    const { body: error } = await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer fake`)
      .expect(401);

    expect(error).toStrictEqual({ message: 'Unauthorized', statusCode: 401 });
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

  it.skip('/login (POST) and /profile (GET) by keycloak', async () => {
    const res = await request(app.getHttpServer())
      .post('/keycloak/login')
      .send({ username: 'john', password: 'changeme' })
      .expect(201)
      .expect(/access_token/);

    expect(res.body.access_token).toBeDefined();
    expect(res.body.access_token).toEqual(12345);

    const { body: profile } = await request(app.getHttpServer())
      .get('/keycloak/profile')
      .set(
        'Authorization',
        `Bearer ${'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJURG1VSFdyWXRSa0RfNDczOEhvaW1iQkRLYVhSMW5HT0hfSWc0TE5jaVNRIn0.eyJleHAiOjE1ODg1OTQ2MjcsImlhdCI6MTU4ODU5NDMyNywiYXV0aF90aW1lIjoxNTg4NTkzMDg2LCJqdGkiOiI0NTE5Yzk3YS01NzJlLTRlMDUtOTRiMC0wZjA0MDExYTQzMjYiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLWplZmYtdGlhbi5jbG91ZC5va3RldG8ubmV0L2F1dGgvcmVhbG1zL1VuaUhlYXJ0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImFkMzU2ODU0LWY4ZjMtNDU1OC1iMzExLTIyNTdhODhkZTdlNSIsInR5cCI6IkJlYXJlciIsImF6cCI6IlVuaUhlYXJ0LUNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJmNWUyZjYyMy0wYmNjLTRjMTQtYTc2Yy1kYjM5OTNlYTEwNGIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vdW5paGVhcnQucGEtY2EubWUiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoidW5paGVhcnQifQ.fE3z3G97H-5I-tG2j8rNObjUI951DBIShHm9wIW6tBxiAsbVPNeuBiD4Sm9W1wQn_8K4AUsmItoyQHozfE-1Qh4hGMsbcrGAkkCi0NNnYcPFKnWoaTfWLSISrcIUMIASFG9CeU1uHK3eShAiftbFMeZrcXBrmZVEGUYolevoxUPIqawGkzyKMKAAW_CL1UZ7ucXKi4uXi0243E5D0Y-HI0kO1h0-fKNdCaiHVYXedxaHKsxDlU1QLHeo3vWVtoVEwXnswASBsHXc1fnpYUw1QcL5jxBBpaw4RFB1zkRvgsIlPE_qubgOm9Mg54Pi9nnYJIxPqoaEvG6jJLiwS_EP1w'}`,
      )
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
