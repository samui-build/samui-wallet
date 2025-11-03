import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import type { ClusterInputFindMany } from './dto/cluster-input-find-many.ts'
import type { Cluster } from './entity/cluster.ts'

import { clusterSchemaFindMany } from './schema/cluster-schema-find-many.ts'

export async function dbClusterFindMany(db: Database, input: ClusterInputFindMany = {}): Promise<Cluster[]> {
  const parsedInput = clusterSchemaFindMany.parse(input)
  const { data, error } = await tryCatch(
    db.clusters
      .orderBy('name')
      .filter((item) => {
        const matchEndpoint = !parsedInput.endpoint || item.endpoint.includes(parsedInput.endpoint)
        const matchId = !parsedInput.id || item.id === parsedInput.id
        const matchName = !parsedInput.name || item.name.includes(parsedInput.name)
        const matchType = !parsedInput.type || item.type === parsedInput.type

        return matchName && matchType && matchEndpoint && matchId
      })
      .toArray(),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error finding clusters`)
  }
  return data
}
