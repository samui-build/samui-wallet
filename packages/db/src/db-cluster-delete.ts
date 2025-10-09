import { tryCatch } from '@workspace/core/try-catch'
import type { Db } from './db'

export async function dbClusterDelete(db: Db, id: string): Promise<void> {
  const { data, error } = await tryCatch(db.clusters.delete(id))
  if (error) {
    console.log(error)
    throw new Error(`Error deleting cluster with id ${id}`)
  }
  return data
}
