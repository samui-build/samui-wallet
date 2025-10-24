import { env } from '@workspace/env/env'

import type { Database } from './database'

export async function dbPopulate(db: Database) {
  const now = new Date()
  const activeClusterId = crypto.randomUUID()
  await db.clusters.bulkAdd([
    {
      createdAt: now,
      endpoint: 'http://localhost:8899',
      id: crypto.randomUUID(),
      name: 'Localnet',
      type: 'solana:localnet',
      updatedAt: now,
    },
    {
      createdAt: now,
      endpoint: 'https://api.devnet.solana.com',
      id: activeClusterId,
      name: 'Devnet',
      type: 'solana:devnet',
      updatedAt: now,
    },
    {
      createdAt: now,
      endpoint: 'https://api.testnet.solana.com',
      id: crypto.randomUUID(),
      name: 'Testnet',
      type: 'solana:testnet',
      updatedAt: now,
    },
  ])
  await db.preferences.bulkAdd([
    {
      createdAt: now,
      id: crypto.randomUUID(),
      key: 'activeClusterId',
      updatedAt: now,
      value: activeClusterId,
    },
    {
      createdAt: now,
      id: crypto.randomUUID(),
      key: 'apiEndpoint',
      updatedAt: now,
      value: env('apiEndpoint'),
    },
  ])
}
