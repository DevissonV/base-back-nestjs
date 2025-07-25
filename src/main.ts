import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ResponseInterceptor } from '@shared/interceptors/response.interceptor';
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { AuditInterceptor } from '@shared/interceptors/audit.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new AuditInterceptor(), 
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 5000;

  await app.listen(port);
  logger.log(`App running on port ${port}`);
}

bootstrap();
