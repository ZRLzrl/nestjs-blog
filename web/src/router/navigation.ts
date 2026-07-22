import { EditOutlined, TeamOutlined } from '@ant-design/icons'
import type { ElementType } from 'react'

export interface NavItem {
  key: string
  label: string
  path: string
  icon?: ElementType
}

const ALWAYS_VISIBLE_NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '文章列表', path: '/' },
  // { key: 'about', label: '项目介绍', path: '/about' },
]

export function getNavItems(
  isAuthenticated: boolean,
  isAdmin: boolean,
): NavItem[] {
  if (!isAuthenticated) {
    return ALWAYS_VISIBLE_NAV_ITEMS
  }

  return [
    ...ALWAYS_VISIBLE_NAV_ITEMS,
    {
      key: 'new',
      icon: EditOutlined,
      label: '写文章',
      path: '/articles/new',
    },
    ...(isAdmin
      ? [
          {
            key: 'admin',
            icon: TeamOutlined,
            label: '用户管理',
            path: '/admin/users',
          },
        ]
      : []),
  ]
}

export function getSelectedNavKey(routeKey?: string | null) {
  if (!routeKey) return ''
  if (routeKey === 'about') return 'about'
  if (routeKey === 'article-list') return 'home'
  if (routeKey === 'article-new' || routeKey === 'article-edit') return 'new'
  if (routeKey === 'admin-users') return 'admin'
  return ''
}
