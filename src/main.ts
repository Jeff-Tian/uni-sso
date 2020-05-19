import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { trustedHosts } from './config/trusted-hosts';
import cookieParser from 'cookie-parser';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: trustedHosts,
      methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    logger: new LoggerService(),
  });
  app.use(cookieParser());

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(
      `application started listening to "${port}", "${process.env.NODE_ENV}" environment`,
    );
  });
}

bootstrap();
