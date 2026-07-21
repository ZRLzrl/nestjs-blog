import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import { useThemeStore } from '@/store/theme'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const techStack = [
  { name: 'React 19', icon: '⚛️', desc: '声明式 UI 框架' },
  { name: 'NestJS 11', icon: '🏗️', desc: 'Node.js 服务端框架' },
  { name: 'TypeScript', icon: '📘', desc: '类型安全的开发体验' },
  { name: 'PostgreSQL', icon: '🐘', desc: '关系型数据库' },
  { name: 'Ant Design', icon: '🎨', desc: '企业级 UI 组件库' },
  { name: 'GSAP', icon: '✨', desc: '高性能动画引擎' },
  { name: 'Vite', icon: '⚡', desc: '极速构建工具' },
  { name: 'Zustand', icon: '🪢', desc: '轻量状态管理' },
]

const features = [
  {
    title: '📝 文章管理',
    desc: '支持文章的创建、编辑、删除。富文本编辑器让写作体验流畅自然，分页列表与标题搜索让查找更加高效。',
  },
  {
    title: '💬 评论互动',
    desc: '登录用户可对文章发表评论、点赞互动。扁平化的评论结构，简洁直观的社交反馈。',
  },
  {
    title: '🔐 权限控制',
    desc: '基于 JWT 的认证体系，区分普通用户和管理员角色。文章归属保护，管理操作权限隔离。',
  },
  {
    title: '🌙 暗色模式',
    desc: '支持一键切换亮色/暗色主题，持久化存储偏好设置。无论白天黑夜，阅读体验始终舒适。',
  },
]

const archLayers = [
  {
    title: '🌐 前端层 (React SPA)',
    items: [
      'React 19 + TypeScript',
      'Vite 8 构建',
      'Ant Design 组件库',
      'Zustand 状态管理',
      'Axios HTTP 客户端',
    ],
  },
  {
    title: '🔗 API 层 (NestJS)',
    items: [
      'NestJS 11 + Express',
      'JWT 身份认证',
      'MikroORM 数据映射',
      'Swagger 接口文档',
      'Pino 日志记录',
    ],
  },
  {
    title: '🗄️ 数据层 (PostgreSQL)',
    items: [
      'PostgreSQL 关系型数据库',
      'MikroORM 迁移管理',
      '用户/文章/评论/点赞 四张核心表',
      '外键约束与级联删除',
    ],
  },
]

export default function About() {
  const pageRef = useRef<HTMLDivElement>(null)
  const { isDark } = useThemeStore()

  useGSAP(
    () => {
      // Hero 标题动画（进场）
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power4.out',
        },
      )
      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.4,
          ease: 'power3.out',
        },
      )
      gsap.fromTo(
        '.hero-indicator',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay: 1.2,
          ease: 'power2.out',
        },
      )

      // Hero 背景视差
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
      gsap.to('.hero-bg-shape', {
        rotation: 10,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // 各板块标题滚动渐入
      gsap.utils.toArray<HTMLElement>('.section-title').forEach((title) => {
        gsap.fromTo(
          title,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // 技术栈卡片交错渐入
      gsap.fromTo(
        '.tech-card',
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.tech-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      // 功能卡片交替滑入
      gsap.fromTo(
        '.feature-card:nth-child(odd)',
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
      gsap.fromTo(
        '.feature-card:nth-child(even)',
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      // 架构层逐层揭示
      gsap.fromTo(
        '.arch-layer',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.arch-section',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      // 架构层内项目列表交错
      gsap.utils.toArray<HTMLElement>('.arch-item').forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // 结语区域动画
      gsap.fromTo(
        '.cta-content',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    },
    { scope: pageRef },
  )

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      {/* ========== Hero 全屏标题区 ========== */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 渐变背景 */}
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950" />
        {/* 装饰形状 */}
        <div className="hero-bg-shape absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-500/10 dark:to-purple-500/10 blur-3xl" />
        <div className="hero-bg-shape absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 dark:from-indigo-500/10 dark:to-pink-500/10 blur-3xl" />

        {/* 内容 */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            项目介绍
          </h1>
          <p className="hero-subtitle text-lg md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            一个基于 NestJS 与 React 构建的全栈博客系统，
            <br className="hidden sm:block" />
            旨在实践现代 Web 开发技术栈与工程最佳实践。
          </p>
        </div>

        {/* 向下滚动指示器 */}
        <div className="hero-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
          <span className="text-sm">向下滚动</span>
          <svg
            className="animate-bounce w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ========== 技术栈展示 ========== */}
      <section className="relative py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-center mb-4">
            技术栈
          </h2>
          <p className="section-title text-gray-500 dark:text-gray-400 text-center mb-16 max-w-xl mx-auto">
            前端到后端，每一层都经过精心选择
          </p>

          <div className="tech-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="tech-card group relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 cursor-default"
              >
                <div className="text-3xl mb-3">{tech.icon}</div>
                <h3 className="font-semibold text-base mb-1">{tech.name}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {tech.desc}
                </p>
                {/* hover 高亮效果 */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-blue-400/30 dark:group-hover:ring-blue-400/20 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 核心功能 ========== */}
      <section className="relative py-24 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-center mb-4">
            核心功能
          </h2>
          <p className="section-title text-gray-500 dark:text-gray-400 text-center mb-16 max-w-xl mx-auto">
            简洁而不简单的博客体验
          </p>

          <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="feature-card p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 项目架构 ========== */}
      <section className="arch-section relative py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-center mb-4">
            项目架构
          </h2>
          <p className="section-title text-gray-500 dark:text-gray-400 text-center mb-16 max-w-xl mx-auto">
            清晰的分层架构，各司其职
          </p>

          <div className="flex flex-col items-center gap-0">
            {archLayers.map((layer, idx) => (
              <div key={layer.title} className="arch-layer w-full max-w-2xl">
                {/* 层卡片 */}
                <div className="relative p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-bold mb-3">{layer.title}</h3>
                  <ul className="space-y-2">
                    {layer.items.map((item) => (
                      <li
                        key={item}
                        className="arch-item text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* 层级之间的连接线 */}
                {idx < archLayers.length - 1 && (
                  <div className="flex justify-center py-3">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-indigo-300 dark:from-blue-600 dark:to-indigo-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 结语区域 ========== */}
      <section className="cta-section relative py-24 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 overflow-hidden">
        {/* 装饰 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 dark:from-blue-500/5 dark:to-purple-500/5 blur-3xl" />

        <div className="cta-content relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">开始探索</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            这个项目还在不断演进中。欢迎浏览文章、注册账号，
            <br />
            体验完整的博客交互流程。
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-400 dark:text-gray-500">
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              React 19
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              NestJS 11
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              TypeScript
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              PostgreSQL
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
