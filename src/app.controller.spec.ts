import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { getModelToken } from 'nestjs-typegoose';
import { User } from './users/user.model';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from './config/config.service';
import { HttpModule } from '@nestjs/common';
import { KeycloakConnectModule } from '@jeff-tian/nest-keycloak-connect';

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
              secret: configService.get('JWT_SECRET'),
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
        user: {
          userId: 1,
          username: 'john',
        },
      });

      expect(res.access_token).toBeDefined();
    });
  });

  describe('config', () => {
    it('should show config', async () => {
      const res = await appController.getConfig();

      expect(res).toEqual('test');
    });
  });
});
