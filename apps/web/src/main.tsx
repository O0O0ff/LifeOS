import ReactDOM from 'react-dom/client'

import { createRouter, RouterProvider } from '@tanstack/react-router'
import '@workspace/ui/globals.css'
import { routeTree } from './routeTree.gen.ts'
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const router = createRouter({
  routeTree,
})

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
