import type { Cluster } from '@workspace/db/entity/cluster'

import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbClusterLive() {
  return useLiveQuery<Cluster[], Cluster[]>(() => db.clusters.orderBy('name').toArray(), [], [])
}
