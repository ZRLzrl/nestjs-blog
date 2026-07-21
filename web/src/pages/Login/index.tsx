import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Card, Form, Input, Button, Typography, message } from 'antd'
import { useNavigate, Link } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

const { Title } = Typography

interface LoginForm {
  username: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()

  const onFinish = async (values: LoginForm) => {
    try {
      await login(values)
      message.success('登录成功')
      navigate('/', { replace: true })
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message || error?.message || '用户名或密码错误'
      message.error(errMsg)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          登录
        </Title>
        <Form<LoginForm> onFinish={onFinish} size="large" autoComplete="off">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, message: '用户名至少 2 个字符' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 个字符' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          还没有账号？<Link to="/register">立即注册</Link>
        </div>
      </Card>
    </div>
  )
}
