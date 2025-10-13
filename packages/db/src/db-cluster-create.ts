import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { ClusterInputCreate } from './dto/cluster-input-create'

import { clusterSchemaCreate } from './schema/cluster-schema-create'

export async function dbClusterCreate(db: Database, input: ClusterInputCreate): Promise<string> {
  const now = new Date()
  const { data, error } = await tryCatch(
    db.clusters.add({
      ...clusterSchemaCreate.parse(input),
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
