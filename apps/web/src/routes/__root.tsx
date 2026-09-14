/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 16:57:47
 * @LastEditTime: 2026-09-14 18:54:53
 * @FilePath: \life-os\apps\web\src\routes\__root.tsx
 */
import { authClient } from '@/lib/auth-client'
import { Link, Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    // 1. 登录页放行，避免死循环
    if (location.pathname === '/login') return

    try {
      const { data: session } = await authClient.getSession()
      console.log('🚀 ~ session:', session)
      if (!session) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        })
      }
    } catch (error) {
      // redirect 本身是特殊对象，必须原样抛回给 Router
      if (error instanceof Response) throw error
      if (error && typeof error === 'object' && 'to' in error) throw error

      // 网络异常等，一律视为未登录
      console.error('获取会话失败:', error)
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="flex gap-2 bg-gray-100 p-2 text-lg">
        <Link
          to="/"
          activeProps={{ className: 'font-bold' }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
