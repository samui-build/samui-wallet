import { Dexie, type Table } from 'dexie'

import type { Account } from './entity/account.js'
import type { Cluster } from './entity/cluster.js'
import type { Preference } from './entity/preference.js'
import type { Wallet } from './entity/wallet.js'

import { dbPopulate } from './db-populate.js'

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
      accounts: 'id, name, order',
      clusters: 'id, name, type',
      preferences: 'id, &key',
      wallets: 'id, accountId, derivationIndex, publicKey, type',
    })

    this.on('populate', async () => {
      await dbPopulate(this)
    })
  }
}
