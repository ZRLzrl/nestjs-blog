import { create } from 'zustand'
import { tokenUtil } from '@/utils/token'
import { authApi, type LoginRequest, type RegisterRequest } from '@/api/auth'

interface User {
  id: string
  username: string
  role: 'user' | 'admin'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,

  loadFromStorage: () => {
    const token = tokenUtil.getToken()
    const user = tokenUtil.getUser()
    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      })
    }
  },

  login: async (data: LoginRequest) => {
    set({ loading: true })
    try {
      const res = await authApi.login(data)
      tokenUtil.setToken(res.token)
      tokenUtil.setUser(res.user)
      set({
        token: res.token,
        user: res.user,
        isAuthenticated: true,
        isAdmin: res.user.role === 'admin',
        loading: false,
      })
    } catch {
      set({ loading: false })
      throw new Error('登录失败')
    }
  },

  register: async (data: RegisterRequest) => {
    set({ loading: true })
    try {
      await authApi.register(data)
      set({ loading: false })
    } catch {
      set({ loading: false })
      throw new Error('注册失败')
    }
  },

  logout: () => {
    tokenUtil.clear()
    authApi.logout().catch(() => {})
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
    })
  },
}))
