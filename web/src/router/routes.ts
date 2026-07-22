import { matchPath } from 'react-router-dom'

import About from '@/pages/About'
import AdminUsers from '@/pages/AdminUsers'
import ArticleDetail from '@/pages/ArticleDetail'
import ArticleEditor from '@/pages/ArticleEditor'
import ArticleList from '@/pages/ArticleList'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

export interface RouteConfig {
  path: string
  key: string
  Component: React.ComponentType
  requiresAuth?: boolean
  requiresAdmin?: boolean
  requiresGuest?: boolean
  keepAlive?: boolean
}

/** 路由配置：路径顺序从精确到模糊 */
export const ROUTE_CONFIG: RouteConfig[] = [
  { path: '/', key: 'article-list', Component: ArticleList, keepAlive: true },
  { path: '/about', key: 'about', Component: About },
  {
    path: '/articles/new',
    key: 'article-new',
    Component: ArticleEditor,
    requiresAuth: true,
  },
  {
    path: '/articles/:id/edit',
    key: 'article-edit',
    Component: ArticleEditor,
    requiresAuth: true,
  },
  { path: '/articles/:id', key: 'article-detail', Component: ArticleDetail },
  { path: '/login', key: 'login', Component: Login, requiresGuest: true },
  {
    path: '/register',
    key: 'register',
    Component: Register,
    requiresGuest: true,
  },
  {
    path: '/admin/users',
    key: 'admin-users',
    Component: AdminUsers,
    requiresAuth: true,
    requiresAdmin: true,
  },
]

/** 获取当前匹配的路由 */
export function getActiveRoute(pathname: string) {
  return ROUTE_CONFIG.find((route) => matchPath(route.path, pathname)) ?? null
}
