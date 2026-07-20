import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  Button,
  Space,
  Input,
  Modal,
  message,
  Skeleton,
  Divider,
  Tooltip,
  Tag,
  Empty,
} from 'antd'
import {
  FileTextOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { articleApi, type ArticleDetail as ArticleDetailType } from '@/api/article'
import { useAuthStore } from '@/store/auth'
import { useRouteParam } from '@/hooks/useRouteParams'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

export default function ArticleDetail() {
  const id = useRouteParam('id')
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin } = useAuthStore()

  const [article, setArticle] = useState<ArticleDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [liking, setLiking] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)
  const [deletingArticle, setDeletingArticle] = useState(false)

  const fetchArticle = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await articleApi.getDetail(id)
      setArticle(data)
    } catch {
      message.error('文章不存在')
      navigate('/', { replace: true })
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    fetchArticle()
  }, [fetchArticle])

  // 点赞/取消点赞
  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      message.warning('请先登录')
      return
    }
    if (!id) return
    setLiking(true)
    try {
      const res = await articleApi.toggleLike(id)
      setArticle((prev) =>
        prev
          ? { ...prev, likedByMe: res.liked, likeCount: res.likeCount }
          : prev,
      )
    } catch {
      // error handled by interceptor
    } finally {
      setLiking(false)
    }
  }

  // 发表评论
  const handleAddComment = async () => {
    if (!id || !commentContent.trim()) return
    setSubmittingComment(true)
    try {
      const newComment = await articleApi.addComment(id, { content: commentContent.trim() })
      message.success('评论成功')
      setCommentContent('')
      setArticle((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : prev,
      )
    } catch {
      // error handled by interceptor
    } finally {
      setSubmittingComment(false)
    }
  }

  // 删除评论
  const handleDeleteComment = (commentId: string) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这条评论吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        if (!id) return
        setDeletingCommentId(commentId)
        try {
          await articleApi.deleteComment(id, commentId)
          message.success('评论已删除')
          setArticle((prev) =>
            prev
              ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) }
              : prev,
          )
        } catch {
          // error handled by interceptor
        } finally {
          setDeletingCommentId(null)
        }
      },
    })
  }

  // 删除文章
  const handleDeleteArticle = () => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这篇文章吗？删除后不可恢复，其下的所有评论和点赞也将一并移除。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        if (!id) return
        setDeletingArticle(true)
        try {
          await articleApi.delete(id)
          message.success('文章已删除')
          navigate('/', { replace: true })
        } catch {
          // error handled by interceptor
        } finally {
          setDeletingArticle(false)
        }
      },
    })
  }

  // 判断是否有权限编辑（作者或管理员）
  const canEdit = article && (isAdmin || user?.id === article.author.id)
  // 判断是否有权限删除评论
  const canDeleteComment = (commentAuthorId: string) =>
    isAdmin || user?.id === commentAuthorId

  const formatDate = (dateStr: string) => dayjs(dateStr).format('YYYY-MM-DD HH:mm')

  if (loading) {
    return (
      <div>
        <Title level={3}>
          <FileTextOutlined /> 文章详情
        </Title>
        <Card>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </div>
    )
  }

  if (!article) return null

  return (
    <div>
      <Button
        type="link"
        style={{ padding: 0, marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        ← 返回文章列表
      </Button>

      <Card>
        <Title level={2}>{article.title}</Title>

        <Space
          style={{ color: '#999', fontSize: 13, marginBottom: 24 }}
          separator={<span>·</span>}
          wrap
        >
          <span>
            <UserOutlined style={{ marginRight: 4 }} />
            {article.author.username}
          </span>
          <span>
            <CalendarOutlined style={{ marginRight: 4 }} />
            发布于 {formatDate(article.createdAt)}
          </span>
          {article.updatedAt !== article.createdAt && (
            <Tooltip title={`最后编辑于 ${formatDate(article.updatedAt)}`}>
              <span>已编辑</span>
            </Tooltip>
          )}
        </Space>

        {canEdit && (
          <Space style={{ marginBottom: 16, marginLeft: 16 }}>
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/articles/${id}/edit`)}
            >
              编辑文章
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={deletingArticle}
              onClick={handleDeleteArticle}
            >
              删除文章
            </Button>
          </Space>
        )}

        <Divider />

        <Paragraph
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {article.content}
        </Paragraph>

        <Divider />

        {/* 点赞区域 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Button
            size="large"
            icon={
              article.likedByMe ? (
                <HeartFilled style={{ color: '#ff4d4f' }} />
              ) : (
                <HeartOutlined />
              )
            }
            loading={liking}
            onClick={handleToggleLike}
          >
            {article.likedByMe ? '已点赞' : '点赞'} ({article.likeCount})
          </Button>
        </div>

        {/* 评论区域 */}
        <div>
          <Title level={4}>
            <MessageOutlined /> 评论 ({article.comments.length})
          </Title>

          {/* 发表评论 */}
          {isAuthenticated ? (
            <div style={{ marginBottom: 24 }}>
              <TextArea
                rows={3}
                placeholder="写下你的评论..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <Button
                type="primary"
                loading={submittingComment}
                disabled={!commentContent.trim()}
                onClick={handleAddComment}
              >
                发表评论
              </Button>
            </div>
          ) : (
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
              请<a onClick={() => navigate('/login')}>登录</a>后发表评论
            </Text>
          )}

          {/* 评论列表 */}
          {article.comments.length === 0 ? (
            <Empty description="暂无评论" />
          ) : (
            <div>
              {article.comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-color, #f0f0f0)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Space>
                      <UserOutlined />
                      <Text strong>{comment.author.username}</Text>
                      {comment.author.id === article.author.id && (
                        <Tag color="blue" style={{ fontSize: 11, lineHeight: '18px' }}>
                          作者
                        </Tag>
                      )}
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDate(comment.createdAt)}
                      </Text>
                    </Space>
                    {canDeleteComment(comment.author.id) && (
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        loading={deletingCommentId === comment.id}
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                  <Paragraph
                    style={{
                      margin: '8px 0 0',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {comment.content}
                  </Paragraph>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
