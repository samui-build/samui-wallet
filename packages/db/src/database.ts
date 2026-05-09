import { encryptWithVaultKey, isEncryptedValue } from '@workspace/vault/encrypted-value'
import {
  createUnsecuredWalletProtection,
  isWalletProtection,
  unlockUnsecuredWalletProtection,
} from '@workspace/vault/wallet-protection'
import { Dexie, type Table, type Transaction } from 'dexie'
import type { AccountInternal } from './account/account-internal.ts'
import { accountSanitizer } from './account/account-sanitizer.ts'
import type { BookmarkAccount } from './bookmark-account/bookmark-account.ts'
import type { BookmarkTransaction } from './bookmark-transaction/bookmark-transaction.ts'
import { createDbVault } from './create-db-vault.ts'
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
    const stores = {
      accounts: 'id, [order+walletId], derivationIndex, order, publicKey, type, walletId',
      bookmarkAccounts: 'id, address, label, updatedAt',
      bookmarkTransactions: 'id, signature, label, updatedAt',
      networks: 'id, name, type',
      settings: 'id, &key',
      wallets: 'id, name, order',
    }

    this.version(1).stores(stores)
    this.version(2).stores(stores).upgrade(migrateLegacyPlaintextWalletsToUnsecured)

    this.accounts.hook('reading', accountReadingHook)
    this.wallets.hook('reading', walletReadingHook)

    this.on('populate', async () => {
      await populate({ db: this, vault: createDbVault({ db: this }) })
    })
  }
}

function accountReadingHook(account: AccountInternal | undefined) {
  return account ? accountSanitizer(account) : account
}

function walletReadingHook(wallet: WalletInternal | undefined) {
  return wallet ? walletSanitizer(wallet) : wallet
}

async function migrateLegacyPlaintextWalletsToUnsecured(transaction: Transaction): Promise<void> {
  const accounts = transaction.table<AccountInternal, string>('accounts')
  const wallets = transaction.table<WalletInternal, string>('wallets')
  const legacyWallets = await wallets.toCollection().raw().toArray()

  for (const wallet of legacyWallets) {
    if (!wallet.mnemonic || isEncryptedValue(wallet.mnemonic) || isWalletProtection(wallet.secret)) {
      continue
    }

    const protection = createUnsecuredWalletProtection()
    const key = await Dexie.waitFor(unlockUnsecuredWalletProtection({ protection }))
    await wallets.update(wallet.id, {
      mnemonic: await Dexie.waitFor(encryptWithVaultKey({ key, value: wallet.mnemonic })),
      secret: protection,
    })

    const walletAccounts = await accounts.where('walletId').equals(wallet.id).raw().toArray()
    for (const account of walletAccounts) {
      if (!account.secretKey || isEncryptedValue(account.secretKey)) {
        continue
      }
      await accounts.update(account.id, {
        secretKey: await Dexie.waitFor(encryptWithVaultKey({ key, value: account.secretKey })),
      })
    }
  }
}
