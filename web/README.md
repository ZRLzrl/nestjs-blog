## 包管理工具
- pnpm

## 技术选型

- vite(v8.1.4)
- react(v19.2.7)
- react router dom
- typescript
- ant design
- zustand
- ahooks
- axios
- dayjs
- GSAP (GreenSock Animation Platform)
- tailwindcss v4
- @gsap/react

---

## 页面路由

| 路径 | 页面 | 权限 |
|------|------|------|
| `/` | 文章列表 | 公开 |
| `/about` | **项目介绍**（新增） | **公开** |
| `/articles/new` | 写文章 | 需登录 |
| `/articles/:id/edit` | 编辑文章 | 需登录（作者/管理员） |
| `/articles/:id` | 文章详情 | 公开 |
| `/login` | 登录 | 公开 |
| `/register` | 注册 | 公开 |
| `/admin/users` | 用户管理 | 管理员 |

---

## 「项目介绍」页面（`/about`）

使用 **TailwindCSS v4** + **GSAP + ScrollTrigger** 打造的炫酷动画着陆页面。

- **安装**：`tailwindcss` + `@tailwindcss/vite`（CSS-first 配置，Vite 插件集成）
- **动画**：GSAP 官方 `useGSAP()` hook + ScrollTrigger 实现滚动驱动的视差、渐入、交错、逐层揭示等效果
- **暗色模式**：通过 Tailwind `dark:` 变体（适配 `[data-theme="dark"]`）一键适配
- **内容**：项目概览 → 技术栈 → 核心功能 → 项目架构 → 结语

---

## 主题切换

项目内置**亮色/暗色**主题切换功能。

### 实现方式

- 基于 antd `ConfigProvider` 的 `theme.algorithm` 属性，通过切换 `defaultAlgorithm` / `darkAlgorithm` 实现组件主题切换
- 使用 Zustand store（`store/theme.ts`）管理主题状态，并持久化到 `localStorage`
- 跟随系统偏好：首次加载时自动检测 `prefers-color-scheme`，默认匹配系统主题
- 通过 `<html data-theme="dark|light">` 属性配合 CSS 选择器适配全局背景色

### 使用

- 页面顶部导航栏左侧（登录按钮左边）提供 ☀️/🌙 图标按钮，点击即可切换
- 主题偏好会自动保存，刷新后保持
