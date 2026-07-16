import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import ArticleList from '@/pages/ArticleList'
import ArticleDetail from '@/pages/ArticleDetail'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ArticleEditor from '@/pages/ArticleEditor'
import AdminUsers from '@/pages/AdminUsers'

export function AppRoutes() {
  return (
    <Routes>
      {/* 所有路由都包在 Layout 中 */}
      <Route element={<Layout />}>
        {/* 公开路由 */}
        <Route path="/" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 需登录 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/articles/new" element={<ArticleEditor />} />
          <Route path="/articles/:id/edit" element={<ArticleEditor />} />
        </Route>

        {/* 仅管理员 */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  )
}
