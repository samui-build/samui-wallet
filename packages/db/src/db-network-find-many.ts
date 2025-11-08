import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import type { NetworkInputFindMany } from './dto/network-input-find-many.ts'
import type { Network } from './entity/network.ts'

import { networkSchemaFindMany } from './schema/network-schema-find-many.ts'

export async function dbNetworkFindMany(db: Database, input: NetworkInputFindMany = {}): Promise<Network[]> {
  const parsedInput = networkSchemaFindMany.parse(input)
  const { data, error } = await tryCatch(
    db.networks
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
    throw new Error(`Error finding networks`)
  }
  return data
}
