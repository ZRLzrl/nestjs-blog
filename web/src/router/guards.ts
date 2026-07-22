import type { RouteConfig } from '@/router/routes'

interface ResolveRouteRedirectParams {
  route: RouteConfig | null
  isAuthenticated: boolean
  isAdmin: boolean
}

export function resolveRouteRedirect({
  route,
  isAuthenticated,
  isAdmin,
}: ResolveRouteRedirectParams) {
  if (route?.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  if (route?.requiresGuest && isAuthenticated) {
    return '/'
  }

  if (route?.requiresAdmin && !isAdmin) {
    return '/'
  }

  return null
}
