import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { ClusterInputCreate } from './dto/cluster-input-create.ts'

import { clusterSchemaCreate } from './schema/cluster-schema-create.ts'

export async function dbClusterCreate(db: Database, input: ClusterInputCreate): Promise<string> {
  const now = new Date()
  // TODO: Add runtime check to ensure Cluster.type is valid
  const parsedInput = clusterSchemaCreate.parse(input)
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error creating cluster`)
    },
    try: () =>
      db.clusters.add({
        ...parsedInput,
        createdAt: now,
        id: crypto.randomUUID(),
        updatedAt: now,
      }),
  })

  const data = await Effect.runPromise(result)
  return data
}
