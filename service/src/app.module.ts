import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArticleModule } from './article/article.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CommonModule } from './common/common.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { rateLimitConfig } from './common/configs/rate-limit.js';
import { InteractionModule } from './interaction/interaction.module.js';
import mikroOrmConfig from './mikro-orm.config.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    // 数据库
    MikroOrmModule.forRoot(mikroOrmConfig),

    // 限流 ThrottlerModule 配置
    ThrottlerModule.forRoot(rateLimitConfig),

    // 业务模块
    CommonModule,
    AuthModule,
    ArticleModule,
    InteractionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // 全局响应包装
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    // 全局异常过滤
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    // 全局 ThrottlerGuard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
