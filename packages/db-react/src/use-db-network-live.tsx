import { db } from '@workspace/db/db'
import { dbNetworkFindMany } from '@workspace/db/db-network-find-many'
import type { Network } from '@workspace/db/entity/network'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useDbNetworkLive() {
  const data = useRootLoaderData()
  if (!data?.networks) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Network[], Network[]>(() => dbNetworkFindMany(db), [], data.networks)
}
