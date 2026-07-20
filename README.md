# 博客项目需求文档 V1.0

## 1. 项目概述
一个极简的全栈博客系统，用于练习用户认证、角色鉴权及常见交互逻辑。

## 2. 用户角色与权限

| 操作 | 游客（未登录） | 普通用户 | 管理员 |
|------|----------------|----------|--------|
| 注册 | ✅ | - | - |
| 登录 | ✅ | - | - |
| 查看文章列表 | ✅ | ✅ | ✅ |
| 查看单篇文章详情 | ✅ | ✅ | ✅ |
| 退出登录 | - | ✅ | ✅ |
| 发布文章 | ❌ | ✅ | ✅ |
| 编辑自己的文章 | ❌ | ✅ | ✅ |
| 删除自己的文章 | ❌ | ✅ | ✅ |
| 删除他人文章 | ❌ | ❌ | ✅（含其他管理员） |
| 对文章点赞 | ❌ | ✅ | ✅ |
| 取消点赞 | ❌ | ✅ | ✅ |
| 对文章发表评论 | ❌ | ✅ | ✅ |
| 删除自己的评论 | ❌ | ✅ | ✅ |
| 删除他人评论 | ❌ | ❌ | ✅ |
| 查看所有用户列表 | ❌ | ❌ | ✅ |
| 冻结/解冻用户 | ❌ | ❌ | ✅ |

**权限说明**
- 游客仅能注册、登录和浏览所有文章（列表与详情），无法进行任何写操作或互动。
- 管理员具备普通用户的所有权限，并额外拥有管理能力。
- 管理员可删除任意文章，包括其他管理员所发的文章，删除前需二次确认。
- 管理员可删除任意评论。
- 点赞为 toggle 逻辑：同一用户对同一篇文章只能点一次赞，再次点击取消点赞。
- 评论为扁平结构，不支持回复某条评论（无父子关系）。

## 3. 功能需求

### 3.1 用户认证模块
- **注册**  
  输入用户名和密码完成注册，用户名需唯一。注册成功后自动成为普通用户。
- **登录**  
  验证用户名和密码，成功后返回身份凭证，后续操作携带该凭证以识别身份与角色。
- **退出登录**  
  客户端清除身份凭证，回到游客状态。

### 3.2 文章管理模块
- **发布文章**  
  需填写标题和正文，作者自动记录为当前登录用户。
- **文章列表**  
  所有人可见，按发布时间倒序排列，支持分页。每篇文章显示标题、作者、发布时间、点赞数、评论数。
- **文章详情**  
  展示完整内容、当前用户的点赞状态（已点赞/未点赞）、所有评论。
- **编辑文章**  
  作者可编辑自己发布的内容；管理员可编辑任意文章。
- **删除文章**  
  - 普通用户：仅能删除自己的文章，前端仅对本人文章显示删除入口。
  - 管理员：可删除任意文章，对所有文章均显示删除入口，操作前需二次确认。
  - 删除文章时，其下所有点赞和评论一并移除。

### 3.3 互动模块
- **点赞**  
  - 登录用户对文章可点赞/取消点赞，实时更新点赞总数。
  - 需防止同一用户重复点赞（通过业务逻辑保证）。
- **评论**  
  - 登录用户可在文章详情页发表评论。
  - 评论列表平铺展示，显示评论者用户名、内容和时间。
  - 普通用户可删除自己的评论，管理员可删除任意评论。

### 3.4 用户管理模块（管理员专属）
- **用户列表查看**  
  管理员可查看所有注册用户的信息，至少包括用户名、角色和注册时间。
- **冻结/解冻用户**  
  管理员可冻结普通用户的账号，冻结后该用户无法登录。管理员账号不可被冻结。前端以标签形式展示用户状态（正常/已冻结），操作时需二次确认。

## 4. 数据模型概要
- **User**  
  存储用户名、加密后的密码、角色（user/admin）、注册时间。
- **Article**  
  存储标题、正文、作者关联、发布时间、更新时间。
- **Like**  
  记录用户与文章的点赞关系，确保同一用户对同一篇文章只有一条记录。
- **Comment**  
  存储评论内容、评论者、所属文章、评论时间。

## 5. 全局行为
- 所有需要身份认证的操作，若未登录则拒绝并提示登录。
- 所有需要管理员权限的操作，若非管理员则拒绝并提示权限不足。
- 删除操作（文章/评论）均需要前端二次确认，防止误操作。
- 列表接口均需支持分页，避免数据量过大。

----------------------------------------------------------------

# 数据库设计文档 V1.0

## 1. 数据库概述
- **数据库类型**：PostgreSQL
- **ORM 框架**：MikroORM
- **字符集**：UTF-8
- **命名规范**：表名使用蛇形命名法（snake_case），字段名使用蛇形命名法（snake_case）

## 2. 数据库表设计

### 2.1 用户表 (user)

| 字段名 | 数据类型 | 长度/范围 | 是否为空 | 默认值 | 说明 |
|--------|----------|-----------|----------|--------|------|
| id | UUID | - | NOT NULL | gen_random_uuid() | 主键，使用UUID |
| username | VARCHAR | 50 | NOT NULL | - | 用户名，唯一索引 |
| password | VARCHAR | 255 | NOT NULL | - | 加密后的密码（bcrypt） |
| role | VARCHAR | 10 | NOT NULL | 'user' | 角色：user/admin |
| is_frozen | BOOLEAN | - | NOT NULL | FALSE | 是否冻结：true=已冻结，false=正常 |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 更新时间，自动更新 |

**索引**：
- 主键索引：id
- 唯一索引：username

**约束说明**：
- username 唯一，不能重复
- role 只能是 'user' 或 'admin'
- created_at 创建时自动设置，不可修改
- updated_at 每次更新记录时自动更新

### 2.2 文章表 (article)

| 字段名 | 数据类型 | 长度/范围 | 是否为空 | 默认值 | 说明 |
|--------|----------|-----------|----------|--------|------|
| id | UUID | - | NOT NULL | gen_random_uuid() | 主键 |
| title | VARCHAR | 200 | NOT NULL | - | 文章标题 |
| content | TEXT | - | NOT NULL | - | 文章正文 |
| author_id | UUID | - | NOT NULL | - | 作者ID，外键关联user表 |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 更新时间，自动更新 |

**索引**：
- 主键索引：id
- 普通索引：author_id
- 普通索引：created_at（用于按时间倒序查询）

**约束说明**：
- author_id 外键关联 user 表的 id，级联删除（CASCADE：删除用户时，该用户的所有文章一并删除）
- title 不能为空，长度限制200字符
- content 为 TEXT 类型，无长度限制

### 2.3 点赞表 (like)

| 字段名 | 数据类型 | 长度/范围 | 是否为空 | 默认值 | 说明 |
|--------|----------|-----------|----------|--------|------|
| id | UUID | - | NOT NULL | gen_random_uuid() | 主键 |
| user_id | UUID | - | NOT NULL | - | 点赞用户ID |
| article_id | UUID | - | NOT NULL | - | 被点赞文章ID |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 点赞时间 |

**索引**：
- 主键索引：id
- **唯一复合索引**：user_id + article_id（确保同一用户对同一篇文章只能点赞一次）
- 普通索引：article_id（查询某篇文章的点赞数）

**约束说明**：
- user_id 外键关联 user 表的 id，级联删除
- article_id 外键关联 article 表的 id，级联删除
- 唯一约束确保点赞的唯一性，防止重复点赞
- 该表仅记录点赞关系，不存储点赞数量（数量通过 COUNT 实时计算）

### 2.4 评论表 (comment)

| 字段名 | 数据类型 | 长度/范围 | 是否为空 | 默认值 | 说明 |
|--------|----------|-----------|----------|--------|------|
| id | UUID | - | NOT NULL | gen_random_uuid() | 主键 |
| content | TEXT | - | NOT NULL | - | 评论内容 |
| user_id | UUID | - | NOT NULL | - | 评论者ID |
| article_id | UUID | - | NOT NULL | - | 所属文章ID |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 评论时间 |

**索引**：
- 主键索引：id
- 普通索引：article_id（查询某篇文章的所有评论）
- 普通索引：user_id（查询某用户的所有评论）

**约束说明**：
- user_id 外键关联 user 表的 id，级联删除
- article_id 外键关联 article 表的 id，级联删除
- 评论为扁平结构，无 parent_id（不支持回复评论）
- 评论内容不能为空

## 3. 实体关系图（ER图文字描述）


**关系说明**：
- 一个用户可以有多篇文章（一对多）
- 一篇文章只属于一个用户（多对一）
- 一个用户可以给多篇文章点赞（一对多）
- 一篇文章可以被多个用户点赞（一对多）
- 一个用户可以发表多条评论（一对多）
- 一篇文章可以有多条评论（一对多）

## 4. 级联删除策略

| 关联关系 | 级联策略 | 说明 |
|----------|----------|------|
| user → article | CASCADE | 删除用户时，自动删除其所有文章 |
| user → like | CASCADE | 删除用户时，自动删除其所有点赞记录 |
| user → comment | CASCADE | 删除用户时，自动删除其所有评论 |
| article → like | CASCADE | 删除文章时，自动删除该文章的所有点赞 |
| article → comment | CASCADE | 删除文章时，自动删除该文章的所有评论 |

## 5. 数据字典补充说明

### 5.1 角色枚举值
| 值 | 说明 |
|-----|------|
| user | 普通用户 |
| admin | 管理员 |

### 5.2 默认管理员初始化
系统首次启动时，需要通过数据库迁移脚本（seeder）手动插入一个默认管理员账号，或提供初始化脚本。
- 默认管理员用户名：admin
- 默认密码：初始化时指定（建议首次登录后强制修改，练手项目可简化）

## 6. 性能优化建议
- 文章列表查询时，使用 created_at 倒序索引提升排序性能
- 点赞数实时查询可使用 COUNT 聚合，后续若数据量大可考虑在 article 表增加冗余字段 like_count
- 评论数同理，可在 article 表增加冗余字段 comment_count
- 分页查询使用 LIMIT + OFFSET 或游标分页（基于 created_at）

---

## 接口文档 (API 文档)

## 1. 文档说明

### 1.1 基础信息
- **基础路径**：`/api/v1`
- **认证方式**：Bearer Token（JWT），在请求头中传递 `Authorization: Bearer <token>`
- **请求格式**：`application/json`
- **响应格式**：`application/json`

### 1.2 通用响应结构

所有接口统一返回以下格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | number | 业务状态码（见下方状态码说明） |
| message | string | 提示信息 |
| data | object/array | 响应数据，失败时可能为 null |

### 1.3 通用状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误（如缺少必填字段、格式错误） |
| 401 | 未认证（Token 缺失或无效） |
| 403 | 权限不足（非管理员执行管理员操作） |
| 404 | 资源不存在 |
| 409 | 资源冲突（如用户名已存在） |
| 500 | 服务器内部错误 |

### 1.4 分页参数

列表接口统一使用以下分页参数（Query）：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | number | 1 | 页码，从 1 开始 |
| limit | number | 10 | 每页条数，最大 100 |

分页响应格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

## 2. 用户认证

### 2.1 注册

创建新用户，注册成功后自动成为普通用户（role = user）。

> **权限**：游客可访问

```
POST /auth/register
```

**Request Body：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，长度 2~50 字符，必须唯一 |
| password | string | 是 | 密码，长度 6~50 字符 |

**Response `data`：**

```json
{
  "id": "uuid",
  "username": "string",
  "role": "user",
  "createdAt": "2026-07-15T12:00:00.000Z"
}
```

**错误码：**
- `400` — 参数校验失败（用户名或密码格式不合法）
- `409` — 用户名已存在

---

### 2.2 登录

验证用户名和密码，成功后返回 JWT Token。

> **权限**：游客可访问

```
POST /auth/login
```

**Request Body：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**Response `data`：**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "string",
    "role": "user"
  }
}
```

**错误码：**
- `400` — 参数校验失败
- `401` — 用户名或密码错误 或 账户已被冻结

---

### 2.3 退出登录

客户端清除本地 Token，服务端可选维护 Token 黑名单（练手项目可简化为仅客户端清除）。

> **权限**：需登录

```
POST /auth/logout
```

**Headers：** `Authorization: Bearer <token>`

**Response `data`：** `null`

---

## 3. 文章管理

### 3.1 获取文章列表

分页获取文章列表，按发布时间倒序排列。

> **权限**：所有人可访问（含游客）

```
GET /articles
```

**Query 参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 10 | 每页条数 |
| authorId | string | 否 | - | 按作者 ID 筛选（选填） |

**Response `data`：**

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "string",
      "author": {
        "id": "uuid",
        "username": "string"
      },
      "likeCount": 12,
      "commentCount": 5,
      "createdAt": "2026-07-15T12:00:00.000Z",
      "updatedAt": "2026-07-15T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

> **说明**：列表不返回文章完整正文（content），仅返回标题和摘要信息，详情通过获取单篇文章接口查询。

---

### 3.2 获取文章详情

获取单篇文章的完整内容，包括当前用户的点赞状态和所有评论。

> **权限**：所有人可访问（含游客）

```
GET /articles/:id
```

**Path 参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 文章 UUID |

**Response `data`：**

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "author": {
    "id": "uuid",
    "username": "string"
  },
  "likeCount": 12,
  "likedByMe": false,
  "comments": [
    {
      "id": "uuid",
      "content": "string",
      "author": {
        "id": "uuid",
        "username": "string"
      },
      "createdAt": "2026-07-15T12:00:00.000Z"
    }
  ],
  "createdAt": "2026-07-15T12:00:00.000Z",
  "updatedAt": "2026-07-15T12:00:00.000Z"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| likedByMe | boolean | 当前登录用户是否已点赞（游客始终为 false） |
| comments | array | 文章的所有评论，按时间正序排列 |

**错误码：**
- `404` — 文章不存在

---

### 3.3 发布文章

创建新文章，作者自动记录为当前登录用户。

> **权限**：需登录

```
POST /articles
```

**Headers：** `Authorization: Bearer <token>`

**Request Body：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 文章标题，长度 1~200 字符 |
| content | string | 是 | 文章正文 |

**Response `data`：**

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "authorId": "uuid",
  "createdAt": "2026-07-15T12:00:00.000Z",
  "updatedAt": "2026-07-15T12:00:00.000Z"
}
```

**错误码：**
- `400` — 参数校验失败（标题或内容为空）
- `401` — 未登录

---

### 3.4 编辑文章

修改文章标题和/或正文。

> **权限**：文章作者 或 管理员

```
PATCH /articles/:id
```

**Headers：** `Authorization: Bearer <token>`

**Path 参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 文章 UUID |

**Request Body：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 否 | 新标题（至少传一个字段） |
| content | string | 否 | 新正文（至少传一个字段） |

**Response `data`：**

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "authorId": "uuid",
  "createdAt": "2026-07-15T12:00:00.000Z",
  "updatedAt": "2026-07-15T12:00:00.000Z"
}
```

**错误码：**
- `400` — 参数校验失败
- `401` — 未登录
- `403` — 不是作者且非管理员
- `404` — 文章不存在

---

### 3.5 删除文章

删除文章及其关联的所有点赞和评论（级联删除）。

> **权限**：文章作者 或 管理员

```
DELETE /articles/:id
```

**Headers：** `Authorization: Bearer <token>`

**Path 参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 文章 UUID |

**Response `data`：** `null`

**错误码：**
- `401` — 未登录
- `403` — 不是作者且非管理员
- `404` — 文章不存在

---

## 4. 互动模块

### 4.1 点赞 / 取消点赞

Toggle 逻辑：同一用户对同一篇文章只能点一次赞，再次请求取消点赞。此接口同时处理「点赞」和「取消点赞」两种操作。

> **权限**：需登录

```
POST /articles/:id/likes
```

**Headers：** `Authorization: Bearer <token>`

**Path 参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 文章 UUID |

**Response `data`：**

```json
{
  "liked": true,
  "likeCount": 13
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| liked | boolean | 点赞后的状态（true=已点赞，false=已取消） |
| likeCount | number | 当前文章的最新点赞总数 |

**错误码：**
- `401` — 未登录
- `404` — 文章不存在

---

### 4.2 发表评论

对文章发表评论（扁平结构，不支持回复评论）。

> **权限**：需登录

```
POST /articles/:id/comments
```

**Headers：** `Authorization: Bearer <token>`

**Path 参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 文章 UUID |

**Request Body：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 评论内容，不能为空 |

**Response `data`：**

```json
{
  "id": "uuid",
  "content": "string",
  "authorId": "uuid",
  "articleId": "uuid",
  "createdAt": "2026-07-15T12:00:00.000Z"
}
```

**错误码：**
- `400` — 参数校验失败（评论内容为空）
- `401` — 未登录
- `404` — 文章不存在

---

### 4.3 删除评论

删除指定评论。

> **权限**：评论作者 或 管理员

```
DELETE /articles/:id/comments/:commentId
```

**Headers：** `Authorization: Bearer <token>`

**Path 参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 文章 UUID |
| commentId | string | 评论 UUID |

**Response `data`：** `null`

**错误码：**
- `401` — 未登录
- `403` — 不是评论作者且非管理员
- `404` — 文章或评论不存在

---

## 5. 用户管理（管理员专属）

### 5.1 获取用户列表

查看所有注册用户的信息。

> **权限**：管理员

```
GET /users
```

**Headers：** `Authorization: Bearer <token>`

**Query 参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 10 | 每页条数 |

**Response `data`：**

```json
{
  "items": [
    {
      "id": "uuid",
      "username": "string",
      "role": "user",
      "isFrozen": false,
      "createdAt": "2026-07-15T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

**错误码：**
- `401` — 未登录
- `403` — 非管理员

---

### 5.2 冻结用户

冻结指定普通用户的账号，冻结后该用户无法登录。

> **权限**：管理员

```
PATCH /users/:id/freeze
```

**Headers：** `Authorization: Bearer <token>`

**Path 参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 用户 UUID |

**Response `data`：**

```json
{
  "id": "uuid",
  "isFrozen": true
}
```

**错误码：**
- `401` — 未登录
- `403` — 非管理员 或 尝试冻结管理员账号
- `404` — 用户不存在

---

### 5.3 解冻用户

解冻指定用户的账号，解冻后该用户可以正常登录。

> **权限**：管理员

```
PATCH /users/:id/unfreeze
```

**Headers：** `Authorization: Bearer <token>`

**Path 参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 用户 UUID |

**Response `data`：**

```json
{
  "id": "uuid",
  "isFrozen": false
}
```

**错误码：**
- `401` — 未登录
- `403` — 非管理员
- `404` — 用户不存在

---

## 6. API 接口速览表

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | /auth/register | 游客 | 注册 |
| POST | /auth/login | 游客 | 登录 |
| POST | /auth/logout | 需登录 | 退出 |
| GET | /articles | 所有人 | 获取文章列表（分页） |
| GET | /articles/:id | 所有人 | 获取文章详情 |
| POST | /articles | 需登录 | 发布文章 |
| PATCH | /articles/:id | 作者/管理员 | 编辑文章 |
| DELETE | /articles/:id | 作者/管理员 | 删除文章 |
| POST | /articles/:id/likes | 需登录 | 点赞/取消点赞（toggle） |
| POST | /articles/:id/comments | 需登录 | 发表评论 |
| DELETE | /articles/:id/comments/:commentId | 作者/管理员 | 删除评论 |
| GET | /users | 管理员 | 获取用户列表 |
| PATCH | /users/:id/freeze | 管理员 | 冻结用户 |
| PATCH | /users/:id/unfreeze | 管理员 | 解冻用户 |

---

# 技术方案/架构图

## 前端架构

文档路径：[前端](web/README.md)

--------------

## 后端架构

文档路径：[后端](service/README.md)

---

## 目录说明
后端目录：service/
前端目录：web/