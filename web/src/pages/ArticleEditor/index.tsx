import { Card, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function ArticleEditor() {
  const { id } = useParams()
  const isEditing = Boolean(id)

  return (
    <div>
      <Title level={3}>
        <EditOutlined /> {isEditing ? '编辑文章' : '发布文章'}
      </Title>
      <Card>
        <Typography.Text type="secondary">
          文章编辑功能（待实现）
          {isEditing && <span> — 编辑文章 ID: {id}</span>}
        </Typography.Text>
      </Card>
    </div>
  )
}
