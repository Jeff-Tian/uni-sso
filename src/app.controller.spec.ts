import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigService } from './config/config.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UsersModule,
        ConfigModule,
        TypegooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            // tslint:disable-next-line:no-console
            console.log('env = ', process.env.NODE_ENV);
            // tslint:disable-next-line:no-console
            console.log('mongo = , ', configService.get('JWT_SECRET'));

            return {
              uri: configService.get('MONGODB_URI'),
            };
          },
          inject: [ConfigService],
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
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
});
