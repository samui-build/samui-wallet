import { tryCatch } from '@workspace/core/try-catch'
import { type Db } from './db'
import { Cluster } from './entity/cluster'

export type DbClusterCreateInput = Omit<Cluster, 'id' | 'createdAt' | 'updatedAt'>

export async function dbClusterCreate(db: Db, input: DbClusterCreateInput): Promise<string> {
  const now = new Date()
  const { data, error } = await tryCatch(
    db.clusters.add({
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error creating cluster`)
  }
  return data
}
