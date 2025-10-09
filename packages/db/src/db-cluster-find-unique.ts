import { tryCatch } from '@workspace/core/try-catch'
import type { Db } from './db'
import { Cluster } from './entity/cluster'

export async function dbClusterFindUnique(db: Db, id: string): Promise<Cluster | undefined> {
  const { data, error } = await tryCatch(db.clusters.get(id))
  if (error) {
    console.log(error)
    throw new Error(`Error finding cluster with id ${id}`)
  }
  return data
}
