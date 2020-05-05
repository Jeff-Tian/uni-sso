import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import PassportKeycloakBearer from 'passport-keycloak-bearer';

@Injectable()
export class KeycloakBearerStrategy extends PassportStrategy(PassportKeycloakBearer) {
  constructor(config: ConfigService) {
    super(
      {
        realm: 'UniHeart',
        url: 'https://keycloak-jeff-tian.cloud.okteto.net/auth',
      },
    );
  }

  async validate(payload: any) {
    // tslint:disable-next-line: no-console
    console.log('validate ', payload);
    return { userId: payload.sub, username: payload.username };
  }
}
