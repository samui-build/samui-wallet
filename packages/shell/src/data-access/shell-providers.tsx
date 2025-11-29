import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient } from '@workspace/db-react/query-client'
import { Toaster } from '@workspace/ui/components/sonner'
import type { ReactNode } from 'react'
import { lazy } from 'react'
import { browser } from 'wxt/browser'
import type { ShellContext } from '../shell-feature.tsx'

const RequestFeatureDialog = lazy(() =>
  import('@workspace/request/request-feature-dialog').then((module) => ({ default: module.RequestFeatureDialog })),
)

interface ShellProviderProps {
  context: ShellContext
  children: ReactNode
}

const persister = createAsyncStoragePersister({
  storage: browser?.storage?.local
    ? {
        getItem: async (key: string) => {
          const result = await browser.storage.local.get(key)
          return result[key] ?? null
        },
        removeItem: async (key: string) => {
          await browser.storage.local.remove(key)
        },
        setItem: async (key: string, value: string) => {
          await browser.storage.local.set({ [key]: value })
        },
      }
    : window.localStorage,
})

export function ShellProviders({ children, context }: ShellProviderProps) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
      <Toaster closeButton richColors />
      {context === 'Sidebar' ? <RequestFeatureDialog /> : null}
    </PersistQueryClientProvider>
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
