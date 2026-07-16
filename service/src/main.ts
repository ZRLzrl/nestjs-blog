import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3000;

  // CORS — 前后端分离
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  // 安全响应头
  app.use(helmet());

  // 全局管道管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, // 禁止非白名单属性
      transformOptions: {
        // 开启隐式转换, 例如：将字符串转换为数字
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('博客 API')
    .setDescription('博客项目后端接口文档')
    .setVersion('1.0')
    .addTag('博客 API')
    .addServer('http://localhost:' + PORT, 'localhost')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(PORT);
  console.log(`🚀 服务已启动: http://localhost:${PORT}`);
  console.log(`📚 Swagger 文档: http://localhost:${PORT}/api/docs`);
}

bootstrap();
