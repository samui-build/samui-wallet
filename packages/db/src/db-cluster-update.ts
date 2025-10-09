import { tryCatch } from '@workspace/core/try-catch'
import type { Db } from './db'
import { Cluster } from './entity/cluster'

export type DbClusterUpdateInput = Partial<Omit<Cluster, 'id' | 'createdAt' | 'updatedAt'>>

export async function dbClusterUpdate(db: Db, id: string, input: DbClusterUpdateInput): Promise<number> {
  const { data, error } = await tryCatch(
    db.clusters.update(id, {
      ...input,
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating cluster with id ${id}`)
  }
  return data
}
