import Dexie, { type Table } from 'dexie'

import type { Account } from './entity/account'
import type { Cluster } from './entity/cluster'
import type { Preference } from './entity/preference'
import type { Wallet } from './entity/wallet'

export interface DatabaseConfig {
  name: string
}

export class Database extends Dexie {
  accounts!: Table<Account>
  clusters!: Table<Cluster>
  preferences!: Table<Preference>
  wallets!: Table<Wallet>

  constructor(config: DatabaseConfig) {
    super(config.name)
    this.version(1).stores({
      accounts: 'id, name',
      clusters: 'id, name, type',
      preferences: 'id, &key',
      wallets: 'id, accountId, derivationIndex, publicKey, type',
    })

    this.on('populate', async () => {
      await this.populate()
    })
  }

  async populate() {
    const now = new Date()
    const activeClusterId = crypto.randomUUID()
    await this.clusters.bulkAdd([
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
    await this.preferences.bulkAdd([
      {
        createdAt: now,
        id: crypto.randomUUID(),
        key: 'activeClusterId',
        updatedAt: now,
        value: activeClusterId,
      },
    ])
  }
}
