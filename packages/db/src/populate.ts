import { env } from '@workspace/env/env'

import type { AppContext } from './app-context.ts'
import { populateNetworks } from './populate-networks.ts'
import { randomId } from './random-id.ts'

export async function populate(ctx: AppContext) {
  const now = new Date()
  await ctx.db.networks.bulkAdd(populateNetworks())
  await ctx.db.settings.bulkAdd([
    { createdAt: now, id: randomId(), key: 'activeNetworkId', updatedAt: now, value: env('activeNetworkId') },
    { createdAt: now, id: randomId(), key: 'apiEndpoint', updatedAt: now, value: env('apiEndpoint') },
  ])
}
