import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/projects/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/projects/$projectId"!</div>
}
