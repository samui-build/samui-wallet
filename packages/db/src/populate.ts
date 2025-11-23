import { env } from '@workspace/env/env'

import type { Database } from './database.ts'
import { populateNetworks } from './populate-networks.ts'
import { randomId } from './random-id.ts'

export async function populate(db: Database) {
  const now = new Date()
  await db.networks.bulkAdd(populateNetworks())
  await db.settings.bulkAdd([
    { createdAt: now, id: randomId(), key: 'activeNetworkId', updatedAt: now, value: env('activeNetworkId') },
    { createdAt: now, id: randomId(), key: 'apiEndpoint', updatedAt: now, value: env('apiEndpoint') },
  ])
}
