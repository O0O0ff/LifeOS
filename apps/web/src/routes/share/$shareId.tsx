import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/share/$shareId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/share/$shareId"!</div>
}
