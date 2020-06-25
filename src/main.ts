import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { trustedHosts } from './config/trusted-hosts';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import xmlParser from 'body-parser-xml';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import swStats from 'swagger-stats';

xmlParser(bodyParser);

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
  app.use(
    // @ts-ignore
    bodyParser.xml({
      limit: '5MB',
      xmlParseOptions: {
        normalize: true,
        normalizeTags: false,
        explicitArray: false,
      },
    }),
  );
  app.use(swStats.getMiddleware({ swaggerSpec: require('../swagger.json') }));

  const options = new DocumentBuilder()
    .setTitle('Uni SSO')
    .setDescription('Single sign on, once and for all')
    .setVersion('1.0')
    .addTag('sso')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(Number(process.env.PORT) || 3000);
}

bootstrap();
