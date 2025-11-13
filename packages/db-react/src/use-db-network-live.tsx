import { db } from '@workspace/db/db'
import { dbNetworkFindMany } from '@workspace/db/db-network-find-many'
import type { Network } from '@workspace/db/entity/network'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRouteLoaderData } from 'react-router'
import type { DbLoaderData } from './db-loader.tsx'

export function useDbNetworkLive() {
  const data = useRouteLoaderData<DbLoaderData>('root')
  if (!data?.networks) {
    throw new Error('Loader not called.')
  }

  return useLiveQuery<Network[], Network[]>(() => dbNetworkFindMany(db), [], data.networks)
}
