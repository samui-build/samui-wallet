import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { DbContext } from '../db-context.ts'
import type { Network } from './network.ts'
import type { NetworkFindManyInput } from './network-find-many-input.ts'

import { networkFindManySchema } from './network-find-many-schema.ts'

export async function networkFindMany(ctx: DbContext, input: NetworkFindManyInput = {}): Promise<Network[]> {
  const parsedInput = networkFindManySchema.parse(input)
  return ctx.db.transaction('r', ctx.db.networks, async () => {
    return tryCatchOrThrow(
      ctx.db.networks
        .orderBy('name')
        .filter((item) => {
          const matchEndpoint = !parsedInput.endpoint || item.endpoint.includes(parsedInput.endpoint)
          const matchId = !parsedInput.id || item.id === parsedInput.id
          const matchName = !parsedInput.name || item.name.includes(parsedInput.name)
          const matchType = !parsedInput.type || item.type === parsedInput.type

          return matchName && matchType && matchEndpoint && matchId
        })
        .toArray(),
      `Error finding networks`,
    )
  })
}
