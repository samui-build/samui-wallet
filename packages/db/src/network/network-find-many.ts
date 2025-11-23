import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import type { Network } from './network.ts'
import type { NetworkFindManyInput } from './network-find-many-input.ts'

import { networkFindManySchema } from './network-find-many-schema.ts'

export async function networkFindMany(db: Database, input: NetworkFindManyInput = {}): Promise<Network[]> {
  const parsedInput = networkFindManySchema.parse(input)
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
