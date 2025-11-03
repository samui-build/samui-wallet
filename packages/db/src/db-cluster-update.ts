import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { ClusterInputUpdate } from './dto/cluster-input-update'

import { parseStrict } from './parse-strict'
import { clusterSchemaUpdate } from './schema/cluster-schema-update'

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
