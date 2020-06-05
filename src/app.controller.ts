import {
  Controller,
  Get,
  HttpCode,
  Options,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard as KeycloakAuthGuard } from '@jeff-tian/nest-keycloak-connect';
import { AuthGuard } from '@nestjs/passport';
import Keycloak from 'keycloak-connect';
import { ConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/config')
  getConfig(): string {
    return this.appService.getConfig();
  }

  // @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    // return this.authService.login(req.user);

    return this.authService.getKeycloakToken({
      username: req.body.username,
      password: req.body.password,
    });
  }

  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(KeycloakAuthGuard)
  // @UseGuards(AuthGuard('Keycloak')) // This will redirect keycloak.jiwai.win for oauth 2
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('Keycloak'))
  @Get('keycloak/login')
  async keycloakLogin(@Request() req, @Response() res) {
    res.cookie('keycloakJWT', req.user.access_token);
    return res.send(req.user);
    // return req.user;
  }

  @Post('keycloak/login')
  async getKeycloakToken(@Request() req) {
    return this.authService.getKeycloakToken({
      username: req.body.username,
      password: req.body.password,
    });
  }

  @UseGuards(KeycloakAuthGuard)
  @Get('keycloak/profile')
  getKeycloakProfile(@Request() req) {
    return req.user;
  }

  @Get('keycloak/logout')
  keycloakLogout(@Request() req, @Response() response) {
    const keycloak = new Keycloak(
      {},
      {
        'auth-server-url': `${this.configService.KEYCLOAK_HOST}/auth`,
        'bearer-only': true,
        'confidential-port': undefined,
        'ssl-required': 'true',
        resource: '',
        realm: this.configService.KEYCLOAK_REALM,
      },
    );

    keycloak.deauthenticated(req);

    const port = req.headers.host.split(':')[1] ?? '';
    const redirectUrl = `${req.protocol}://${req.hostname}${
      port === '' ? '' : ':' + port
    }/`;

    return response.redirect(keycloak.logoutUrl(redirectUrl));
  }

  @Options('auth/login')
  @HttpCode(204)
  async options() {
    return '';
  }
}
