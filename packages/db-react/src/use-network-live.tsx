import { useAppContext } from '@workspace/context-react/use-app-context'
import type { Network } from '@workspace/db/network/network'
import { networkFindMany } from '@workspace/db/network/network-find-many'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useNetworkLive() {
  const ctx = useAppContext()
  const data = useRootLoaderData()
  if (!data?.networks) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Network[], Network[]>(() => networkFindMany(ctx), [ctx], data.networks)
}
