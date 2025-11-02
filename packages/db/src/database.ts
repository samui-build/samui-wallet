import { Dexie, type Table } from 'dexie'
import { dbPopulate } from './db-populate.ts'
import type { Account } from './entity/account.ts'
import type { Cluster } from './entity/cluster.ts'
import type { Preference } from './entity/preference.ts'
import type { Wallet } from './entity/wallet.ts'

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
