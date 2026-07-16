import { ThrottlerModuleOptions } from '@nestjs/throttler';

// 配置 ThrottlerModule
// 用于限制每个 IP 地址的请求频率
export const rateLimitConfig: ThrottlerModuleOptions = [
  {
    name: 'short',
    ttl: 1000,
    limit: 3,
  },
  {
    name: 'medium',
    ttl: 10000,
    limit: 20,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 100,
  },
];
