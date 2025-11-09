import { Effect } from 'effect'

import type { Database } from './database.ts'

export async function dbNetworkDelete(db: Database, id: string): Promise<void> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error deleting network with id ${id}`)
    },
    try: () => db.networks.delete(id),
  })
  const data = await Effect.runPromise(result)
  return data
}
