import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import type { ClusterInputUpdate } from './dto/cluster-input-update.ts'

import { parseStrict } from './parse-strict.ts'
import { clusterSchemaUpdate } from './schema/cluster-schema-update.ts'

export async function dbClusterUpdate(db: Database, id: string, input: ClusterInputUpdate): Promise<number> {
  const parsedInput = parseStrict(clusterSchemaUpdate.parse(input))
  const { data, error } = await tryCatch(
    db.clusters.update(id, {
      ...parsedInput,
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating cluster with id ${id}`)
  }
  return data
}
