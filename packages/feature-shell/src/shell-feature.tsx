import { ShellProviders } from './data-access/shell-providers.tsx'
import '@workspace/ui/globals.css'
import { createAppContext } from '@workspace/context/create-app-context'
import { RouterProvider } from 'react-router'
import { createRouter } from './create-router.tsx'

const ctx = createAppContext()
const router = createRouter(ctx)

export function ShellFeature() {
  return (
    <ShellProviders ctx={ctx}>
      <RouterProvider router={router} />
    </ShellProviders>
  )
}
