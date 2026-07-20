## 包管理工具
- pnpm

## NestJS 工具说明（常用包 + 作用）

### 1. NestJS 核心"工具位"（不一定需要额外包）

- Middleware（中间件）
  - 作用：在路由处理前做通用逻辑（日志、鉴权前置、设置请求上下文、简单限流等）
  - 特点：更偏向"请求进入框架的最早阶段"，拿到的是原生 request/response（Express/Fastify）
- Pipe（管道）
  - 作用：参数校验与转换（DTO 校验、类型转换、默认值处理）
  - 级别区分：全局 Pipe（app.useGlobalPipes）作用于所有路由，适合全局 DTO 校验；方法级/参数级 Pipe（@UsePipes / @Body / @Param 内联）作用于特定端点，适合局部参数转换
  - 常见搭配包：
    - class-validator：基于装饰器的校验规则
    - class-transformer：把 plain object 转成 class 实例并做类型转换
- Guard（守卫 / 权限控制）
  - 作用：决定当前请求是否允许继续（认证、鉴权、RBAC/ABAC、资源级权限）
  - 常见搭配包：
    - @nestjs/jwt：签发与校验 JWT
- Interceptor（拦截器）
  - 作用：在方法调用前后做通用逻辑（响应结构包装、缓存、超时、日志、性能统计、事务边界）
  - 特点：拦截器本质上是 RxJS Observable 流，可用 pipe/map/tap/catchError/timeout/retry 等操作符组合实现响应转换、超时、重试等逻辑
  - 常见搭配包：
    - rxjs：Observable 流式处理
- Exception Filter（异常过滤器）
  - 作用：统一异常到 HTTP 响应的映射与格式（错误码、消息、日志、隐藏内部堆栈）

---

### 2. 安全与网关层

- 节流/限流：@nestjs/throttler
  - 作用：限制单位时间内请求次数，防止暴力刷接口、降低瞬时压力
  - 常见场景：登录/验证码/发送短信、公共查询接口
  - 使用全局限流做一个基本的配置，再根据场景针对个别接口进行调整
- 安全响应头：helmet
  - 作用：设置一组常用安全 HTTP Header，降低 XSS、点击劫持等风险
  - Nest 常见用法：作为中间件应用到全局
- CORS：框架内置（通过 app.enableCors 配置）
  - 作用：前后端分离跨域访问控制
- 密码哈希（任选其一）
  - bcrypt / bcryptjs：传统选择，生态广

---

### 3. 认证与鉴权JWT 

- JWT：@nestjs/jwt
  - 作用：签发与校验 JWT

---

### 4. 参数校验 / DTO / 序列化

- DTO 校验：class-validator
  - 作用：基于装饰器声明校验规则（必填、长度、枚举、邮箱等）
- DTO 转换：class-transformer
  - 作用：把请求体/查询参数转换为 DTO 类实例，支持隐式类型转换、排除字段等
- DTO 类型映射（DTO 派生）：@nestjs/mapped-types
  - 作用：通过 PartialType / PickType / OmitType / IntersectionType 等工具从已有 DTO 派生新 DTO，减少重复定义

---

### 5. API 文档 / Swagger / OpenAPI

- Swagger：@nestjs/swagger
  - 作用：从装饰器生成 OpenAPI 文档、自动生成 Swagger UI 页面
  - 进阶技巧：通过 nest-cli.json 配置 compilerOptions.plugins 启用 Swagger Plugin，自动推断 DTO 属性类型，大幅减少 @ApiProperty 装饰器冗余
  - 注意：在使用PartialType的地方，引入方式需要把'@nestjs/mapped-types' 改为'@nestjs/swagger'，这样才能生成完整的 Swagger 文档

---

### 6. 配置与环境变量

- 配置管理：使用node原生--env-file参数，无需额外包

---

### 7. 构建与编译（性能/开发体验）

- Nest CLI：@nestjs/cli
  - 作用：生成模块/控制器/服务、构建与调试项目
- ts-node / tsconfig-paths（部分项目会用）
  - 作用：本地直接跑 TS、支持路径别名解析

---

### 8. 数据库与 ORM（选型区）

- MikroORM：@mikro-orm/core + @mikro-orm/nestjs
  - 作用：更现代的 ORM 方案，支持 Unit of Work、迁移体系完善

---

### 9. 迁移与种子数据（Seed）

- MikroORM Migrator：@mikro-orm/migrations
  - 作用：MikroORM 的迁移工具

---

### 14. 日志（可观测性的一部分）

- Pino 方案：nestjs-pino + pino
  - 作用：高性能结构化日志，适合生产环境

---

### 19. 数据库

- PostgreSQL：@nestjs/postgres
  - 作用：PostgreSQL 数据库驱动，支持 TypeORM、MikroORM 等 ORM

---
