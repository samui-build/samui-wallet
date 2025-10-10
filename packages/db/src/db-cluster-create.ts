import { tryCatch } from '@workspace/core/try-catch'

import type { Cluster } from './entity/cluster'

import { type Db } from './db'

export type DbClusterCreateInput = Omit<Cluster, 'createdAt' | 'id' | 'updatedAt'>

export async function dbClusterCreate(db: Db, input: DbClusterCreateInput): Promise<string> {
  const now = new Date()
  const { data, error } = await tryCatch(
    db.clusters.add({
      ...input,
      createdAt: now,
      id: crypto.randomUUID(),
      updatedAt: now,
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error creating cluster`)
  }
  return data
}
