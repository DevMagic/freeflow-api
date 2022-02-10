import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { urlencoded, json } from 'express';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const expressApp = express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp)
  );

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({limit: '500mb', extended: true}));

  const config = new DocumentBuilder()
    .setTitle('Freeflow API')
    .setDescription('Freeflow API Doc')
    .setVersion('1.0')
    .addTag('auth', 'Create and Recover Accounts')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log('Port', process.env.PORT || 3000);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
