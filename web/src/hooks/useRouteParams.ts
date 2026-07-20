import { useLocation, matchPath } from 'react-router-dom'

// 路由配置必须与 Layout 中的 ROUTE_CONFIG 保持同步
const ROUTE_PATTERNS = [
  '/articles/new',
  '/articles/:id/edit',
  '/articles/:id',
  '/',
  '/login',
  '/register',
  '/admin/users',
]

/**
 * 提取当前 URL 中的路由参数（替代 useParams，因为不再使用 <Routes>）
 */
export function useRouteParams(): Record<string, string> {
  const location = useLocation()
  for (const pattern of ROUTE_PATTERNS) {
    const match = matchPath(pattern, location.pathname)
    if (match?.params) {
      return match.params as Record<string, string>
    }
  }
  return {}
}

/**
 * 提取指定名称的路由参数
 */
export function useRouteParam(name: string): string | undefined {
  return useRouteParams()[name]
}
