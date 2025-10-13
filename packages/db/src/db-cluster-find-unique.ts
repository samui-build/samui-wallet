import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { Cluster } from './entity/cluster'

export async function dbClusterFindUnique(db: Database, id: string): Promise<Cluster | null> {
  const { data, error } = await tryCatch(db.clusters.get(id))
  if (error) {
    console.log(error)
    throw new Error(`Error finding cluster with id ${id}`)
  }
  return data ? data : null
}
