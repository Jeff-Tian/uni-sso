import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { getModelToken } from 'nestjs-typegoose';
import { User } from './users/user.model';
import { User as UserEntity } from './users/user.entity';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from './config/config.service';
import { HttpModule } from '@nestjs/common';
import { KeycloakConnectModule } from '@jeff-tian/nest-keycloak-connect';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAttribute } from './users/user-attribute.entity';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            return {
              secret: configService.get('JWT_SECRET') as string,
              signOptions: { expiresIn: '60s' },
            };
          },
          inject: [ConfigService],
        }),
        KeycloakConnectModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            authServerUrl: `${configService.KEYCLOAK_HOST}/auth`,
            realm: configService.KEYCLOAK_REALM,
            clientId: configService.KEYCLOAK_CLIENT_ID,
            secret: configService.KEYCLOAK_CLIENT_SECRET,
          }),
          inject: [ConfigService],
        }),
        HttpModule,
      ],
      controllers: [AppController],
      providers: [
        { provide: getModelToken('User'), useValue: User },
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: getRepositoryToken(UserAttribute), useValue: {} },
        UsersService,
        AuthService,
        AppService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('auth', () => {
    it('should login successfully', async () => {
      const res = await appController.login({
        body: {
          username: 'jeff.tian@outlook.com',
          password: process.env.JEFF_PASSWORD,
        },
      });

      res.subscribe(value => {
        expect(value.access_token).toBeDefined();
      });
    });
  });

  describe('config', () => {
    it('should show config', async () => {
      const res = await appController.getConfig();

      expect(res).toEqual('test');
    });
  });
});
