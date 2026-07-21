import { EditOutlined } from '@ant-design/icons'
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  message,
  Skeleton,
  Space,
} from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, matchPath } from 'react-router-dom'

import { articleApi, type ArticleDetail } from '@/api/article'
import { useRouteParam } from '@/hooks/useRouteParams'

const { Title } = Typography
const { TextArea } = Input

interface ArticleForm {
  title: string
  content: string
}

export default function ArticleEditor() {
  const id = useRouteParam('id')
  const navigate = useNavigate()
  const [form] = Form.useForm<ArticleForm>()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)

  // 编辑模式：加载现有文章数据
  useEffect(() => {
    if (!id) return
    setLoading(true)
    articleApi
      .getDetail(id)
      .then((data: ArticleDetail) => {
        form.setFieldsValue({ title: data.title, content: data.content })
      })
      .catch(() => {
        message.error('文章不存在')
        // 仅在当前 URL 确实是编辑路由时才导航，防止隐藏（缓存的）实例误重定向
        if (matchPath('/articles/:id/edit', window.location.pathname)) {
          navigate('/', { replace: true })
        }
      })
      .finally(() => setLoading(false))
  }, [id, form, navigate])

  const onFinish = async (values: ArticleForm) => {
    setSubmitting(true)
    try {
      if (isEditing && id) {
        await articleApi.update(id, values)
        message.success('文章已更新')
        navigate(`/articles/${id}`, { replace: true })
      } else {
        const res = await articleApi.create(values)
        message.success('文章已发布')
        navigate(`/articles/${res.id}`, { replace: true })
      }
    } catch {
      // error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Title level={3}>
          <EditOutlined /> 加载中...
        </Title>
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Button
        type="link"
        style={{ padding: 0, marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        ← 返回
      </Button>

      <Title level={3}>
        <EditOutlined /> {isEditing ? '编辑文章' : '发布文章'}
      </Title>

      <Card>
        <Form<ArticleForm>
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ title: '', content: '' }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[
              { required: true, message: '请输入文章标题' },
              { max: 200, message: '标题不能超过 200 个字符' },
            ]}
          >
            <Input
              size="large"
              placeholder="请输入文章标题"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="正文"
            rules={[{ required: true, message: '请输入文章正文' }]}
          >
            <TextArea
              rows={16}
              placeholder="请输入文章正文..."
              style={{ fontSize: 15, lineHeight: 1.8 }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
              >
                {isEditing ? '保存修改' : '发布文章'}
              </Button>
              <Button size="large" onClick={() => navigate(-1)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
