import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { TypegooseModule } from 'nestjs-typegoose';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const configModule: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    const config = configModule.get<ConfigService>(ConfigService);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule,
        JwtModule.register({
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: '60s' },
        }),
        TypegooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get('MONGODB_URI'),
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [AuthService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
