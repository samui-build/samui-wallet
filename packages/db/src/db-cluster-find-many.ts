import { tryCatch } from '@workspace/core/try-catch'
import type { Db } from './db'
import { Cluster } from './entity/cluster'

export type DbClusterFindManyInput = Partial<Pick<Cluster, 'endpoint' | 'id' | 'name' | 'type'>>

export async function dbClusterFindMany(db: Db, input: DbClusterFindManyInput = {}): Promise<Cluster[]> {
  const { data, error } = await tryCatch(db.clusters.toArray())
  if (error) {
    console.log(error)
    throw new Error(`Error finding clusters`)
  }
  return data?.filter((item) => {
    const matchEndpoint = !input.endpoint || item.endpoint.includes(input.endpoint)
    const matchId = !input.id || item.id === input.id
    const matchName = !input.name || item.name.includes(input.name)
    const matchType = !input.type || item.type === input.type

    return matchName && matchType && matchEndpoint && matchId
  })
}
