import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3006', 'http://localhost:5173'],
  });
  // const app = await NestFactory.create(AppModule, { cors: true });
  // const app = await NestFactory.create(AppModule, {
  //   cors: {
  //     origin: ['http://localhost:3006', 'http://localhost:5173'],
  //     credentials: true,
  //   },
  // });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3000;
  app.setGlobalPrefix('api');
  // app.use(cookieParser());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Social-app')
    .setDescription('The API description')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // SwaggerModule.setup('swagger', app, document, {
  //   swaggerOptions: {
  //     requestInterceptor: (req) => {
  //       req.credentials = 'include';
  //       return req;
  //     },
  //   },
  // });

  await app.listen(port, () => {
    console.log('Server is running on: http://localhost:3000/api/');
  });
}
bootstrap();
