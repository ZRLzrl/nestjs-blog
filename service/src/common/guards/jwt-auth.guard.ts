import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_OPTIONAL_KEY } from '../decorators/auth-optional.decorator.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    const isOptional = this.reflector.getAllAndOverride<boolean>(
      AUTH_OPTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );
    // 可选认证：不强制要求登录，有 token 则解析用户，没有则返回 null
    if (isOptional) {
      return user || null;
    }
    if (err || !user) {
      throw err || new UnauthorizedException('请先登录');
    }
    return user;
  }
}
