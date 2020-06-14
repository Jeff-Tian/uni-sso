import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { KeycloakStrategy } from './strategies/keycloak.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET') as string,
          signOptions: { expiresIn: '60s' },
        };
      },
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    KeycloakStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
