import {
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  Modal,
  Skeleton,
  message,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState, useCallback } from 'react'

import { userApi, type UserItem } from '@/api/user'

const { Title } = Typography

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userApi.getList({ page, limit: 20 })
      setUsers(res.items)
      setTotal(res.meta.total)
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const formatDate = (dateStr: string) =>
    dayjs(dateStr).format('YYYY-MM-DD HH:mm')

  const handleFreeze = (record: UserItem) => {
    Modal.confirm({
      title: '冻结用户',
      content: `确定要冻结用户「${record.username}」吗？冻结后该用户将无法登录。`,
      okText: '确定冻结',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await userApi.freeze(record.id)
          message.success(`已冻结用户「${record.username}」`)
          fetchUsers()
        } catch {
          // error handled by interceptor
        }
      },
    })
  }

  const handleUnfreeze = (record: UserItem) => {
    Modal.confirm({
      title: '解冻用户',
      content: `确定要解冻用户「${record.username}」吗？解冻后该用户可以正常登录。`,
      okText: '确定解冻',
      cancelText: '取消',
      onOk: async () => {
        try {
          await userApi.unfreeze(record.id)
          message.success(`已解冻用户「${record.username}」`)
          fetchUsers()
        } catch {
          // error handled by interceptor
        }
      },
    })
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {username}
        </span>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) =>
        role === 'admin' ? (
          <Tag icon={<CrownOutlined />} color="gold">
            管理员
          </Tag>
        ) : (
          <Tag icon={<UserOutlined />} color="blue">
            普通用户
          </Tag>
        ),
    },
    {
      title: '状态',
      dataIndex: 'isFrozen',
      key: 'isFrozen',
      render: (isFrozen: boolean) =>
        isFrozen ? (
          <Tag color="red">已冻结</Tag>
        ) : (
          <Tag color="green">正常</Tag>
        ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: UserItem) => {
        if (record.role === 'admin') return null

        return record.isFrozen ? (
          <Button
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            style={{ color: '#52c41a' }}
            onClick={() => handleUnfreeze(record)}
          >
            解冻
          </Button>
        ) : (
          <Button
            type="link"
            size="small"
            danger
            icon={<StopOutlined />}
            onClick={() => handleFreeze(record)}
          >
            冻结
          </Button>
        )
      },
    },
  ]

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          <TeamOutlined /> 用户管理
        </Title>
      </div>

      <Card>
        {loading ? (
          <>
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </>
        ) : (
          <Table<UserItem>
            dataSource={users}
            columns={columns}
            rowKey="id"
            pagination={{
              current: page,
              total,
              pageSize: 20,
              onChange: (p) => setPage(p),
              showSizeChanger: false,
              showTotal: (t) => `共 ${t} 个用户`,
            }}
          />
        )}
      </Card>
    </div>
  )
}
