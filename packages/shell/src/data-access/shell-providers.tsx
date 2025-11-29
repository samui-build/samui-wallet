import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@workspace/db-react/query-client'
import { Toaster } from '@workspace/ui/components/sonner'
import type { ReactNode } from 'react'
import { lazy } from 'react'
import type { ShellContext } from '../shell-feature.tsx'

const RequestFeatureDialog = lazy(() =>
  import('@workspace/request/request-feature-dialog').then((module) => ({ default: module.RequestFeatureDialog })),
)

interface ShellProviderProps {
  context: ShellContext
  children: ReactNode
}

export function ShellProviders({ children, context }: ShellProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster closeButton richColors />
      {context === 'Sidebar' ? <RequestFeatureDialog /> : null}
    </QueryClientProvider>
  )
}

// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
