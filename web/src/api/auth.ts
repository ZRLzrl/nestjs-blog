import apiClient from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    role: 'user' | 'admin'
  }
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface RegisterResponse {
  id: string
  username: string
  role: 'user' | 'admin'
  createdAt: string
}

export const authApi = {
  login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post('/auth/login', data)
  },

  register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post('/auth/register', data)
  },

  logout(): Promise<null> {
    return apiClient.post('/auth/logout')
  },
}
