import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigService } from './config/config.service';
import { KeycloakConnectModule } from '@jeff-tian/nest-keycloak-connect';
import { WechatModule } from './wechat/wechat.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule,
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
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
    WechatModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
