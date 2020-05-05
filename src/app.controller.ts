import {
  Controller,
  Get,
  HttpCode,
  Options,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {
  }

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

  @UseGuards(AuthGuard('keycloak'))
  @Post('keycloak/login')
  async getKeycloakToken(@Request() req) {
    return { access_token: '123' };
  }

  @UseGuards(AuthGuard('keycloak'))
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
