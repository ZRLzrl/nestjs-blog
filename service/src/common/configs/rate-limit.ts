import { ThrottlerModuleOptions } from '@nestjs/throttler';

// 配置 ThrottlerModule
// 用于限制每个 IP 地址的请求频率
// 注意：KeepAlive 页面缓存会在路由切换时让多个隐藏组件同时发起 API 请求，
// 因此短时限流不宜过严。
export const rateLimitConfig: ThrottlerModuleOptions = [
  {
    name: 'short',
    ttl: 1000,
    limit: 30,
  },
  {
    name: 'medium',
    ttl: 10000,
    limit: 100,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 500,
  },
];
