import {
  Controller,
  Get,
  HttpCode,
  HttpService,
  Options,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard as KeycloakAuthGuard } from '@jeff-tian/nest-keycloak-connect';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
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
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('Keycloak'))
  @Get('keycloak/login')
  async keycloakLogin(@Request() req) {
    return 'hello';
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

  @Options('auth/login')
  @HttpCode(204)
  async options() {
    return '';
  }
}
