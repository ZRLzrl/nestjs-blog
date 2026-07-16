import apiClient from './client'
import type { PaginatedResponse } from './article'

export interface UserItem {
  id: string
  username: string
  role: 'user' | 'admin'
  createdAt: string
}

export const userApi = {
  getList(params: {
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<UserItem>> {
    return apiClient.get('/users', { params })
  },
}
