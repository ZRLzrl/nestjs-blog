import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service.js';
import { Public } from './common/decorators/public.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // 公共接口
  // 无需登录即可访问
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
