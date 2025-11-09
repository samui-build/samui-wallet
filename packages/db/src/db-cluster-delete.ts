import { Effect } from 'effect'

import type { Database } from './database.ts'

export async function dbClusterDelete(db: Database, id: string): Promise<void> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error deleting cluster with id ${id}`)
    },
    try: () => db.clusters.delete(id),
  })

  const data = await Effect.runPromise(result)
  return data
}
