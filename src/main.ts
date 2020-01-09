import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const trustedHosts = [
  /^https:\/\/[^.]+\.jiwai\.win/,
  /^https:\/\/jiwai\.win/,
  /^https:\/\/[^.]+\.pa-ca\.me/,
  /^https:\/\/pa-ca\.me/,
  /^http:\/\/localhost/,
  /^https:\/\/uni-sso\.herokuapp\.com/,
  /^https:\/\/gatsby-sso\.netlify\.com/,
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: trustedHosts,
      methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
