import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import KS from '@jeff-tian/keycloak-passport';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(KS) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super(
      {
        host: configService.KEYCLOAK_HOST,
        realm: configService.KEYCLOAK_REALM,
        clientID: configService.KEYCLOAK_CLIENT_ID,
        clientSecret: configService.KEYCLOAK_CLIENT_SECRET,
        callbackURL: `/keycloak/login`,
      },
      (accessToken, refreshToken, params, profile, done) => {
        // This is called after a successful authentication has been completed
        // Here's a sample of what you can then do, i.e., write the user to your DB
        // tslint:disable-next-line:no-console
        console.log(
          'access_token = ',
          accessToken,
          refreshToken,
          params,
          profile,
        );
        done(null, {
          ...profile,
          ...params,
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      },
    );
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
