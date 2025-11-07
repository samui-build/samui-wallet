import { Dexie, type Table } from 'dexie'
import { dbPopulate } from './db-populate.ts'
import type { Account } from './entity/account.ts'
import type { Network } from './entity/network.ts'
import type { Setting } from './entity/setting.ts'
import type { Wallet } from './entity/wallet.ts'

export interface DatabaseConfig {
  name: string
}

export class Database extends Dexie {
  accounts!: Table<Account>
  networks!: Table<Network>
  settings!: Table<Setting>
  wallets!: Table<Wallet>

  constructor(config: DatabaseConfig) {
    super(config.name)
    this.version(1).stores({
      accounts: 'id, name, order',
      networks: 'id, name, type',
      settings: 'id, &key',
      wallets: 'id, accountId, derivationIndex, publicKey, type',
    })

    this.on('populate', async () => {
      await dbPopulate(this)
    })
  }
}
