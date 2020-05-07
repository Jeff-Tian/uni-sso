import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { getModelToken } from 'nestjs-typegoose';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { KeycloakConnectModule } from '@jeff-tian/nest-keycloak-connect';
import { HttpModule } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const configModule: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    const config = configModule.get<ConfigService>(ConfigService);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule.register({
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: '60s' },
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
      providers: [
        { provide: getModelToken('User'), useValue: User },
        UsersService,
        AuthService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
