import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div>这是一个侧边栏</div>

      <Outlet />
    </div>
  )
}
