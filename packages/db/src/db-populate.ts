import { env } from '@workspace/env/env'

import type { Database } from './database.ts'

import { getDefaultNetworks } from './get-default-networks.ts'

export async function dbPopulate(db: Database) {
  const now = new Date()
  await db.networks.bulkAdd(getDefaultNetworks())
  await db.settings.bulkAdd([
    { createdAt: now, id: crypto.randomUUID(), key: 'activeNetworkId', updatedAt: now, value: env('activeNetworkId') },
    { createdAt: now, id: crypto.randomUUID(), key: 'apiEndpoint', updatedAt: now, value: env('apiEndpoint') },
  ])
}
