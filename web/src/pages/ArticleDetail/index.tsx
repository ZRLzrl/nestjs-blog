import { Card, Skeleton, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { FileTextOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function ArticleDetail() {
  const { id } = useParams()

  return (
    <div>
      <Title level={3}>
        <FileTextOutlined /> 文章详情
      </Title>
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
      <div style={{ color: '#999', marginTop: 8 }}>文章 ID: {id}</div>
    </div>
  )
}
