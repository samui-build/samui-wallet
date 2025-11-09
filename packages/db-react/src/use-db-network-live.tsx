import { db } from '@workspace/db/db'
import type { Network } from '@workspace/db/entity/network'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbNetworkLive() {
  return useLiveQuery<Network[], Network[]>(() => db.networks.orderBy('name').toArray(), [], [])
}
