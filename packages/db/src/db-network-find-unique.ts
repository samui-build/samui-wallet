import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { Network } from './entity/network.ts'

export async function dbNetworkFindUnique(db: Database, id: string): Promise<Network | null> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error finding network with id ${id}`)
    },
    try: () => db.networks.get(id),
  })

  const data = await Effect.runPromise(result)
  return data ? data : null
}
