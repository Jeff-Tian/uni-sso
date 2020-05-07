import {
  Controller,
  Get,
  HttpCode,
  HttpServer,
  HttpService,
  Options,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard as KeycloakAuthGuard } from '@jeff-tian/nest-keycloak-connect';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/config')
  getConfig(): string {
    return this.appService.getConfig();
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
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
