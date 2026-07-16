import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Button, Space, Typography } from 'antd'
import {
  EditOutlined,
  UserOutlined,
  TeamOutlined,
  LoginOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'
import { useThemeStore } from '@/store/theme'

const { Header, Content, Footer } = AntLayout
const { Text } = Typography

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { isDark, toggle } = useThemeStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // 根据当前路径高亮菜单项
  const selectedKey = (() => {
    if (location.pathname === '/') return 'home'
    if (location.pathname.startsWith('/articles/new')) return 'new'
    if (location.pathname.startsWith('/admin/users')) return 'admin'
    return ''
  })()

  const menuItems = [
    { key: 'home', label: '文章列表', onClick: () => navigate('/') },
    ...(isAuthenticated
      ? [{ key: 'new', icon: <EditOutlined />, label: '写文章', onClick: () => navigate('/articles/new') }]
      : []),
    ...(isAdmin
      ? [{ key: 'admin', icon: <TeamOutlined />, label: '用户管理', onClick: () => navigate('/admin/users') }]
      : []),
  ]

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Text
            strong
            style={{ fontSize: 18, cursor: 'pointer', color: isDark ? '#e8e8e8' : undefined }}
            onClick={() => navigate('/')}
          >
            📝 My Blog
          </Text>
          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ border: 'none', flex: 1, minWidth: 0, background: 'transparent' }}
          />
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
              <Text style={{ color: isDark ? '#e8e8e8' : undefined }}>{user?.username}</Text>
              <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
                退出
              </Button>
            </>
          ) : (
            <>
              <Button type="text" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                登录
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                注册
              </Button>
            </>
          )}
        </Space>
      </Header>

      <Content style={{ padding: '24px 48px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', color: '#999' }}>
        My Blog ©{new Date().getFullYear()}
      </Footer>
    </AntLayout>
  )
}
