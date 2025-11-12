import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // For hackathon/demo mode allow all origins to simplify testing from any host.
  // This intentionally sets origin: true which mirrors the request origin.
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  console.log('CORS enabled for all origins (hackathon mode)');

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Optionally set a global prefix for all routes
  const globalPrefix = process.env.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);

  // Swagger / OpenAPI setup (enabled in non-production by default)
  const enableSwagger = process.env.ENABLE_SWAGGER !== 'false' && process.env.NODE_ENV !== 'production';
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('MindShard API')
      .setDescription('API documentation for MindShard backend')
      .setVersion('0.1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = process.env.SWAGGER_PATH || 'docs';
    SwaggerModule.setup(swaggerPath, app, document);
    console.log(`Swagger available at /${globalPrefix}/${swaggerPath}`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`MindShard backend listening on ${port}`);

  console.log(process.env.DB_NAME)
}

bootstrap();
