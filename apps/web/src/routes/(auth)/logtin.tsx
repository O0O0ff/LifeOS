import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/logtin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/logtin"!</div>
}
