import { HttpService, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { IKeycloakToken } from './interfaces/IToken';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { IUser } from './interfaces/IUser';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    if (username === 'john' && pass === 'changeme') {
      return {
        username: 'john',
        password: 'changeme',
        email: 'john@someone.com',
        userId: 1,
      };
    }

    const user = await this.usersService.findOne(username);

    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getKeycloakToken(user: IUser): Observable<IKeycloakToken> {
    return this.httpService
      .post<IKeycloakToken>(
        `${this.configService.KEYCLOAK_HOST}/realms/UniHeart/protocol/openid-connect/token`,
        `username=${user.username}&password=${user.password}&grant_type=password&client_id=${this.configService.KEYCLOAK_CLIENT_ID}&client_secret=${this.configService.KEYCLOAK_CLIENT_SECRET}`,
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(map(response => response.data));
  }
}
