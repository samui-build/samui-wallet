import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { Cluster } from './entity/cluster.ts'

export async function dbClusterFindUnique(db: Database, id: string): Promise<Cluster | null> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error finding cluster with id ${id}`)
    },
    try: () => db.clusters.get(id),
  })
  const data = await Effect.runPromise(result)

  return data ? data : null
}
