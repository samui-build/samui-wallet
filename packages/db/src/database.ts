import { Dexie, type Table } from 'dexie'
import type { AccountInternal } from './account/account-internal.ts'
import { accountSanitizer } from './account/account-sanitizer.ts'
import type { BookmarkAccount } from './bookmark-account/bookmark-account.ts'
import type { BookmarkTransaction } from './bookmark-transaction/bookmark-transaction.ts'
import type { Network } from './network/network.ts'
import { populate } from './populate.ts'
import type { Setting } from './setting/setting.ts'
import type { WalletInternal } from './wallet/wallet-internal.ts'
import { walletSanitizer } from './wallet/wallet-sanitizer.ts'

export interface DatabaseConfig {
  name: string
}

export class Database extends Dexie {
  accounts!: Table<AccountInternal>
  bookmarkAccounts!: Table<BookmarkAccount>
  bookmarkTransactions!: Table<BookmarkTransaction>
  networks!: Table<Network>
  settings!: Table<Setting>
  wallets!: Table<WalletInternal>

  constructor(config: DatabaseConfig) {
    super(config.name)
    this.version(1).stores({
      accounts: 'id, [order+walletId], derivationIndex, order, publicKey, type, walletId',
      bookmarkAccounts: 'id, address, label, updatedAt',
      bookmarkTransactions: 'id, signature, label, updatedAt',
      networks: 'id, name, type',
      settings: 'id, &key',
      wallets: 'id, name, order',
    })

    this.accounts.hook('reading', accountReadingHook)
    this.wallets.hook('reading', walletReadingHook)

    this.on('populate', async () => {
      await populate({ db: this })
    })
  }
}

function accountReadingHook(account: AccountInternal | undefined) {
  return account ? accountSanitizer(account) : account
}

function walletReadingHook(wallet: WalletInternal | undefined) {
  return wallet ? walletSanitizer(wallet) : wallet
}
