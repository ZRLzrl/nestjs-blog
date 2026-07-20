import {
  EditOutlined,
  UserOutlined,
  TeamOutlined,
  LoginOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { Layout as AntLayout, Button, Space, Typography, Modal } from 'antd'
import { useLocation, useNavigate, Link, matchPath, Navigate } from 'react-router-dom'
import KeepAlive from 'react-activity-keepalive-kit'

import { useAuth } from '@/hooks/useAuth'
import { useThemeStore } from '@/store/theme'
import ArticleList from '@/pages/ArticleList'
import ArticleDetail from '@/pages/ArticleDetail'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ArticleEditor from '@/pages/ArticleEditor'
import AdminUsers from '@/pages/AdminUsers'

const { Header, Content, Footer } = AntLayout
const { Text } = Typography

interface RouteConfig {
  path: string
  key: string
  Component: React.ComponentType
  requiresAuth?: boolean
  requiresAdmin?: boolean
}

/** 路由配置：路径顺序从精确到模糊 */
const ROUTE_CONFIG: RouteConfig[] = [
  { path: '/', key: 'article-list', Component: ArticleList },
  { path: '/articles/new', key: 'article-new', Component: ArticleEditor, requiresAuth: true },
  { path: '/articles/:id/edit', key: 'article-edit', Component: ArticleEditor, requiresAuth: true },
  { path: '/articles/:id', key: 'article-detail', Component: ArticleDetail },
  { path: '/login', key: 'login', Component: Login },
  { path: '/register', key: 'register', Component: Register },
  { path: '/admin/users', key: 'admin-users', Component: AdminUsers, requiresAuth: true, requiresAdmin: true },
]

/** 获取当前匹配的路由 */
function getActiveRoute(pathname: string) {
  return ROUTE_CONFIG.find((r) => matchPath(r.path, pathname)) ?? null
}

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { isDark, toggle } = useThemeStore()

  const activeRoute = getActiveRoute(location.pathname)

  const handleLogout = () => {
    Modal.confirm({
      title: '退出登录',
      content: '确定要退出登录吗？',
      okText: '确定退出',
      cancelText: '取消',
      onOk: () => {
        logout()
        navigate('/')
      },
    })
  }

  // 根据当前路径高亮菜单项
  const selectedKey = (() => {
    if (!activeRoute) return ''
    if (activeRoute.key === 'article-list') return 'home'
    if (activeRoute.key === 'article-new' || activeRoute.key === 'article-edit') return 'new'
    if (activeRoute.key === 'admin-users') return 'admin'
    return ''
  })()

  const navItems = isAuthenticated
    ? [
        { key: 'home', label: '文章列表', path: '/' },
        { key: 'new', icon: <EditOutlined />, label: '写文章', path: '/articles/new' },
        ...(isAdmin ? [{ key: 'admin', icon: <TeamOutlined />, label: '用户管理', path: '/admin/users' }] : []),
      ]
    : []

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: isDark ? '#141414' : '#fff',
          borderBottom: isDark ? '1px solid #303030' : '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
          <Text
            strong
            style={{
              fontSize: 18,
              cursor: 'pointer',
              color: isDark ? '#e8e8e8' : undefined,
            }}
            onClick={() => navigate('/')}
          >
            📝 My Blog
          </Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {navItems.map((item) => (
              <Link key={item.key} to={item.path} style={{ lineHeight: 0 }}>
                <Button
                  type="text"
                  icon={item.icon}
                  style={{
                    fontWeight: selectedKey === item.key ? 600 : 'normal',
                    color:
                      selectedKey === item.key
                        ? '#1677ff'
                        : isDark
                          ? '#e8e8e8'
                          : undefined,
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <Space>
          {/* 主题切换按钮 */}
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggle}
            title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
          />

          {isAuthenticated ? (
            <>
              <UserOutlined />
              <Text style={{ color: isDark ? '#e8e8e8' : undefined }}>
                {user?.username}
              </Text>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                退出
              </Button>
            </>
          ) : (
            <>
              <Button
                type="text"
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
              >
                登录
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                注册
              </Button>
            </>
          )}
        </Space>
      </Header>

      <Content
        style={{
          padding: '24px 48px',
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {activeRoute?.requiresAuth && !isAuthenticated ? (
          <Navigate to="/login" replace />
        ) : activeRoute?.requiresAdmin && !isAdmin ? (
          <Navigate to="/" replace />
        ) : (
          <KeepAlive activeName={activeRoute?.key ?? ''} max={5}>
            {activeRoute ? (() => {
              const Component = activeRoute.Component
              return <Component />
            })() : null}
          </KeepAlive>
        )}
      </Content>

      <Footer style={{ textAlign: 'center', color: '#999' }}>
        My Blog ©{new Date().getFullYear()}
      </Footer>
    </AntLayout>
  )
}
