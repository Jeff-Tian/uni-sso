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
import { LoggerModule } from 'nestjs-pino';
import pinoElastic from 'pino-elasticsearch';
import pinoHttp from 'pino-http';
import { DestinationStream } from 'pino';
import { Params } from 'nestjs-pino/dist';

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
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // tslint:disable-next-line:no-console
        console.log(
          'configService.ELASTIC_SEARCH_NODE = ',
          configService.ELASTIC_SEARCH_NODE,
        );
        return {
          pinoHttp: [
            {
              useLevelLabels: true,
            } as pinoHttp.Options,
            pinoElastic({
              'consistency': 'one',
              'node': configService.ELASTIC_SEARCH_NODE,
              'es-version': 7,
              'bulk-size': 200,
            }) as DestinationStream,
          ],
        } as Params;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
