import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const cfgSrv = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle('Contracts example')
    .setDescription('Пример API по работе с некоторыми договорами')
    .setVersion('0.1')
    .addBearerAuth() // всё по дефолту пусть, и просто закроем роуты через @UseGuards(JwtAuthGuard)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(cfgSrv.get('HTTP_PORT') || 3000);
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
