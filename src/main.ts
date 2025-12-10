import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors();
  //
  // app.enableCors({
  //   origin: 'http://localhost:3001', // Allow requests from this domain
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
  //   allowedHeaders: ['content-type'],
  //   credentials: true, // Allow credentials (cookies, HTTP authentication)
  // });

  const config = new DocumentBuilder()
    .setTitle('Model search backend')
    .setDescription('Описание api model search backend')
    .setVersion('1.0')
    .addTag('model search backend')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
