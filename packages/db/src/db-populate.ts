import { env } from '@workspace/env/env'

import type { Database } from './database.ts'

import { getDefaultClusters } from './get-default-clusters.ts'

export async function dbPopulate(db: Database) {
  const now = new Date()
  await db.clusters.bulkAdd(getDefaultClusters())
  await db.settings.bulkAdd([
    { createdAt: now, id: crypto.randomUUID(), key: 'activeClusterId', updatedAt: now, value: env('activeClusterId') },
    { createdAt: now, id: crypto.randomUUID(), key: 'apiEndpoint', updatedAt: now, value: env('apiEndpoint') },
  ])
}
