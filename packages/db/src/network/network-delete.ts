import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'

export async function networkDelete(db: Database, id: string): Promise<void> {
  const { data, error } = await tryCatch(db.networks.delete(id))
  if (error) {
    console.log(error)
    throw new Error(`Error deleting network with id ${id}`)
  }
  return data
}
