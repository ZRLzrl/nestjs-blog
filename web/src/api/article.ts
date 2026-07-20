import apiClient from './client'

export interface ArticleListItem {
  id: string
  title: string
  author: { id: string; username: string }
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface ArticleDetail {
  id: string
  title: string
  content: string
  author: { id: string; username: string }
  likeCount: number
  likedByMe: boolean
  comments: CommentItem[]
  createdAt: string
  updatedAt: string
}

export interface CommentItem {
  id: string
  content: string
  author: { id: string; username: string }
  createdAt: string
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreateArticleRequest {
  title: string
  content: string
}

export interface UpdateArticleRequest {
  title?: string
  content?: string
}

export interface ToggleLikeResponse {
  liked: boolean
  likeCount: number
}

export interface CreateCommentRequest {
  content: string
}

export const articleApi = {
  getList(
    params: {
      page?: number
      limit?: number
      authorId?: string
      title?: string
    },
    config?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<ArticleListItem>> {
    return apiClient.get('/articles', { params, signal: config?.signal })
  },

  getDetail(id: string): Promise<ArticleDetail> {
    return apiClient.get(`/articles/${id}`)
  },

  create(data: CreateArticleRequest): Promise<ArticleDetail> {
    return apiClient.post('/articles', data)
  },

  update(id: string, data: UpdateArticleRequest): Promise<ArticleDetail> {
    return apiClient.patch(`/articles/${id}`, data)
  },

  delete(id: string): Promise<null> {
    return apiClient.delete(`/articles/${id}`)
  },

  toggleLike(id: string): Promise<ToggleLikeResponse> {
    return apiClient.post(`/articles/${id}/likes`)
  },

  addComment(id: string, data: CreateCommentRequest): Promise<CommentItem> {
    return apiClient.post(`/articles/${id}/comments`, data)
  },

  deleteComment(articleId: string, commentId: string): Promise<null> {
    return apiClient.delete(`/articles/${articleId}/comments/${commentId}`)
  },
}
