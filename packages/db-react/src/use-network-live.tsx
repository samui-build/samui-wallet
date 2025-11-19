import { db } from '@workspace/db/db'
import type { Network } from '@workspace/db/network/network'
import { networkFindMany } from '@workspace/db/network/network-find-many'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useNetworkLive() {
  const data = useRootLoaderData()
  if (!data?.networks) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Network[], Network[]>(() => networkFindMany(db), [], data.networks)
}
