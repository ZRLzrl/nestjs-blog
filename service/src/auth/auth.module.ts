import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { User } from './entities/user.entity.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    // 配置 PassportModule 为 JWT 策略
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // 配置 JwtModule
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      // 配置 JWT 过期时间为 7 天
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
