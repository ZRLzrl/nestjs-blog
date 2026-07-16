import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

/**
 * 管理员才能访问的路由守卫
 * 未登录跳转 /login，非管理员跳转首页
 */
export function AdminRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAdmin = useAuthStore((s) => s.isAdmin)

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}
