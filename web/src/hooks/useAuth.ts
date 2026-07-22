import { useAuthStore } from '@/store/auth'

export function useAuth() {
  // 当前用户信息
  const user = useAuthStore((s) => s.user)
  // 认证状态
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  // 是否为管理员
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const loading = useAuthStore((s) => s.loading)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const logout = useAuthStore((s) => s.logout)

  return { user, isAuthenticated, isAdmin, loading, login, register, logout }
}
