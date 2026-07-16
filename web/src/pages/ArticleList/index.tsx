import { Card, Typography, Skeleton } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function ArticleList() {
  return (
    <div>
      <Title level={3}>
        <UnorderedListOutlined /> 文章列表
      </Title>
      <Card>
        <Skeleton active paragraph={{ rows: 3 }} />
        <Skeleton active paragraph={{ rows: 3 }} style={{ marginTop: 16 }} />
        <Skeleton active paragraph={{ rows: 3 }} style={{ marginTop: 16 }} />
      </Card>
    </div>
  )
}
