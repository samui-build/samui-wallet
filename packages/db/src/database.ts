import { Dexie, type Table } from 'dexie'
import type { Account } from './account/account.ts'
import { dbPopulate } from './db-populate.ts'
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
      accounts: 'id, [order+walletId], derivationIndex, order, publicKey, type, walletId',
      networks: 'id, name, type',
      settings: 'id, &key',
      wallets: 'id, name, order',
    })

    this.on('populate', async () => {
      await dbPopulate(this)
    })
  }
}
