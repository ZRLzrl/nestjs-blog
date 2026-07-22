import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { Layout as AntLayout, Button, Space, Typography, Modal } from 'antd'
import KeepAlive from 'react-activity-keepalive-kit'
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import {
  resolveRouteRedirect,
  getNavItems,
  getSelectedNavKey,
  ROUTE_CONFIG,
  getActiveRoute,
} from '@/router'
import { useThemeStore } from '@/store/theme'

const { Header, Content, Footer } = AntLayout
const { Text } = Typography

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

  const navItems = getNavItems(isAuthenticated, isAdmin)
  const selectedKey = getSelectedNavKey(activeRoute?.key)
  const redirectTo = resolveRouteRedirect({
    route: activeRoute,
    isAuthenticated,
    isAdmin,
  })

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
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = selectedKey === item.key
              return (
                <Link key={item.key} to={item.path} style={{ lineHeight: 0 }}>
                  <Button
                    type="text"
                    icon={Icon ? <Icon /> : undefined}
                    style={{
                      fontWeight: isActive ? 600 : 'normal',
                      color: isActive
                        ? '#1677ff'
                        : isDark
                          ? '#e8e8e8'
                          : undefined,
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            })}
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
        {redirectTo ? (
          <Navigate to={redirectTo} replace />
        ) : (
          <>
            {/* KeepAlive 始终渲染，确保缓存不丢失 */}
            <KeepAlive
              activeName={activeRoute?.keepAlive ? activeRoute.key : undefined}
              max={5}
            >
              {ROUTE_CONFIG.filter((r) => r.keepAlive).map((r) => {
                const Component = r.Component
                return <Component key={r.key} />
              })}
            </KeepAlive>

            {/* 非缓存页面在外部直接渲染 */}
            {activeRoute && !activeRoute.keepAlive
              ? (() => {
                  const Component = activeRoute.Component
                  return <Component />
                })()
              : null}
          </>
        )}
      </Content>

      <Footer style={{ textAlign: 'center', color: '#999' }}>
        My Blog ©{new Date().getFullYear()}
      </Footer>
    </AntLayout>
  )
}
