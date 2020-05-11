import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { trustedHosts } from './config/trusted-hosts';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: trustedHosts,
      methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
