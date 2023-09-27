import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
// import { HttpErrorFilter } from './exceptions/http-error-filter.filter';
// import { GlobalExceptionFilter } from 'exceptions/http-entity-exception.filter';

async function bootstrap() {
  // TODO check cors
  const app = await NestFactory.create(AppModule, { cors: false });

  app.enableCors({ credentials: true, origin: true });
  app.use(cookieParser());

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder().setTitle('Link Storage API').setVersion('1.0').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  app.useGlobalFilters(new HttpExceptionFilter());

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
