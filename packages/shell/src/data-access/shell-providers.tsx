import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@workspace/db-react/query-client'
import { Toaster } from '@workspace/ui/components/sonner'
import type { ReactNode } from 'react'

export function ShellProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster closeButton richColors />
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
