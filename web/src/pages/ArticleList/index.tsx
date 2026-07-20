import {
  UnorderedListOutlined,
  LikeOutlined,
  MessageOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { Card, Typography, Pagination, Space, Skeleton, Input } from 'antd'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import dayjs from 'dayjs'
import { articleApi, type ArticleListItem } from '@/api/article'

const { Title, Text } = Typography

export default function ArticleList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  // 缓存当前参数的 key，组件被 KeepAlive 唤醒时跳过重复请求
  const lastParamsRef = useRef('')

  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const titleKeyword = searchParams.get('title') || ''

  const fetchArticles = useCallback(async () => {
    const paramsKey = `${page}-${limit}-${titleKeyword}`
    // 如果参数和上次完全一致（组件从冻结态恢复），跳过请求
    if (paramsKey === lastParamsRef.current) return

    // 取消上一次未完成的请求
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      const params: { page: number; limit: number; title?: string } = {
        page,
        limit,
      }
      if (titleKeyword) {
        params.title = titleKeyword
      }
      const res = await articleApi.getList(params, { signal: controller.signal })
      lastParamsRef.current = paramsKey
      setArticles(res.items)
      setTotal(res.meta.total)
      setTotalPages(res.meta.totalPages)
    } catch {
      // 请求被取消是预期的，不处理
    } finally {
      setLoading(false)
    }
  }, [page, limit, titleKeyword])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handlePageChange = (p: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(p))
      return prev
    })
  }

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      if (value.trim()) {
        prev.set('title', value.trim())
      } else {
        prev.delete('title')
      }
      prev.set('page', '1')
      return prev
    })
  }

  const formatDate = (dateStr: string) => dayjs(dateStr).format('YYYY-MM-DD HH:mm')

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          <UnorderedListOutlined /> 文章列表
        </Title>
        <Space>
          <Input.Search
            placeholder="搜索文章标题"
            style={{ width: 240 }}
            defaultValue={titleKeyword}
            onSearch={handleSearch}
            allowClear
          />
          <Text type="secondary">共 {total} 篇</Text>
        </Space>
      </div>

      <Card>
        {loading ? (
          <>
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton
              active
              paragraph={{ rows: 2 }}
              style={{ marginTop: 24 }}
            />
            <Skeleton
              active
              paragraph={{ rows: 2 }}
              style={{ marginTop: 24 }}
            />
          </>
        ) : articles.length === 0 ? (
          <div
            style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}
          >
            暂无文章
          </div>
        ) : (
          <div>
            {articles.map((item) => (
              <Card
                key={item.id}
                hoverable
                style={{ marginBottom: 16, cursor: 'pointer' }}
                onClick={() => navigate(`/articles/${item.id}`)}
                styles={{ body: { padding: 20 } }}
              >
                <Title level={4} style={{ marginBottom: 12 }}>
                  {item.title}
                </Title>
                <Space
                  style={{ color: '#999', fontSize: 13 }}
                  separator={<span>·</span>}
                  wrap
                >
                  <span>
                    <UserOutlined style={{ marginRight: 4 }} />
                    {item.author.username}
                  </span>
                  <span>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {formatDate(item.createdAt)}
                  </span>
                  <span>
                    <LikeOutlined style={{ marginRight: 4 }} />
                    {item.likeCount}
                  </span>
                  <span>
                    <MessageOutlined style={{ marginRight: 4 }} />
                    {item.commentCount}
                  </span>
                </Space>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Pagination
              current={page}
              total={total}
              pageSize={limit}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </Card>
    </div>
  )
}
