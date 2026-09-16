/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 16:57:47
 * @LastEditTime: 2026-09-16 20:29:51
 * @FilePath: \life-os\apps\web\src\routes\__root.tsx
 */
import { authClient } from '@/lib/auth-client'
import { Link, Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// 定义不需要登录即可访问的公开路由
const PUBLIC_ROUTES = ['/login', '/register']

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname)

    try {
      // 无论哪个页面，都先尝试获取当前会话
      const { data: session } = await authClient.getSession()
      console.log('🚀 ~ session:', session)

      if (session) {
        // 【情况 1】用户已登录，但试图访问 login/register
        if (isPublicRoute) {
          throw redirect({ to: '/' }) // 强制打回首页
        }
        // 【情况 2】用户已登录，访问其他私有页面 -> 正常放行
      } else {
        // 【情况 3】用户未登录，访问受保护页面
        if (!isPublicRoute) {
          throw redirect({
            to: '/login',
            search: { redirect: location.href }, // 记录原本想去的页面，登录后可跳回
          })
        }
        // 【情况 4】用户未登录，访问 login/register -> 正常放行
      }
    } catch (error) {
      // 必须把 redirect 对象原样抛出，TanStack Router 才能拦截并执行跳转
      if (error instanceof Response) throw error
      if (error && typeof error === 'object' && 'to' in error) throw error

      // 网络异常等情况获取会话失败，一律视为“未登录”状态处理
      console.error('获取会话失败:', error)
      if (!isPublicRoute) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        })
      }
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
