import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import type { Network } from './network.ts'

export async function networkFindUnique(db: Database, id: string): Promise<Network | null> {
  return db.transaction('r', db.networks, async () => {
    const result = await Result.tryPromise(() => db.networks.get(id))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding network with id ${id}`)
    }
    return result.value ? result.value : null
  })
}
