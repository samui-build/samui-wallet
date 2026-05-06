import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'
import type { Network } from './network.ts'

export async function networkFindUnique(db: Database, id: string): Promise<Network | null> {
  return db.transaction('r', db.networks, async () => {
    const data = await tryCatchOrThrow(db.networks.get(id), `Error finding network with id ${id}`)
    return data ? data : null
  })
}
