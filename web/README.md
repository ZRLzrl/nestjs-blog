## 技术选型

- vite(v8.1.4)
- react(v19.2.7)
- react router dom
- typescript
- ant design
- zustand
- ahooks
- axios
- GSAP (GreenSock Animation Platform)

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
