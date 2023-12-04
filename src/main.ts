import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: ['http://localhost:3006', 'http://localhost:5173'],
    // allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    origin: ['http://localhost:3006', 'http://localhost:5173'],
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    // credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3000;
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Social-app')
    .setDescription('The API description')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    console.log('Server is running on: http://localhost:3000/api/');
  });
}
bootstrap();
