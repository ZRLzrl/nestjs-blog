import { Card, Typography, Skeleton } from 'antd'
import { TeamOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function AdminUsers() {
  return (
    <div>
      <Title level={3}>
        <TeamOutlined /> 用户管理
      </Title>
      <Card>
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    </div>
  )
}
