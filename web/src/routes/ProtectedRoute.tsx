import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

/**
 * 需要登录才能访问的路由守卫
 * 未登录时跳转到 /login
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
