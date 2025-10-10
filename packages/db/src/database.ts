import Dexie, { type Table } from 'dexie'

import type { Account } from './entity/account'
import type { Cluster } from './entity/cluster'
import type { Wallet } from './entity/wallet'

export interface DbConfig {
  name: string
}

export class Database extends Dexie {
  accounts!: Table<Account>
  clusters!: Table<Cluster>
  wallets!: Table<Wallet>

  constructor(private readonly config: DbConfig) {
    super(config.name)
    this.version(1).stores({
      accounts: 'id, name',
      clusters: 'id, name, type',
      wallets: 'id, accountId, &publicKey, type',
    })

    this.on('populate', async () => {
      await this.populate()
    })
  }

  async populate() {
    const now = new Date()
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
        id: crypto.randomUUID(),
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
  }
}
