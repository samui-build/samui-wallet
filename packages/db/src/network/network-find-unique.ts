import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import type { Network } from './network.ts'

export async function networkFindUnique(db: Database, id: string): Promise<Network | null> {
  const { data, error } = await tryCatch(db.networks.get(id))
  if (error) {
    console.log(error)
    throw new Error(`Error finding network with id ${id}`)
  }
  return data ? data : null
}
