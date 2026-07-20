import apiClient from './client'
import type { PaginatedResponse } from './article'

export interface UserItem {
  id: string
  username: string
  role: 'user' | 'admin'
  isFrozen?: boolean
  createdAt: string
}

export const userApi = {
  getList(params: {
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<UserItem>> {
    return apiClient.get('/users', { params })
  },

  freeze(id: string) {
    return apiClient.patch(`/users/${id}/freeze`)
  },

  unfreeze(id: string) {
    return apiClient.patch(`/users/${id}/unfreeze`)
  },
}
