/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-14 00:25:58
 * @LastEditTime: 2026-09-14 00:26:05
 * @FilePath: \life-os\apps\web\src\routes\(auth)\login.tsx
 */
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/login"!</div>
}
