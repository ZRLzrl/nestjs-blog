import { SetMetadata } from '@nestjs/common';

export const AUTH_OPTIONAL_KEY = 'authOptional';
/**
 * 标记路由为可选认证：如果请求携带有效 Token 则认证，否则也不拒绝。
 * 适用于「登录用户可看到个性化数据，游客也能访问」的场景。
 */
export const AuthOptional = () => SetMetadata(AUTH_OPTIONAL_KEY, true);
