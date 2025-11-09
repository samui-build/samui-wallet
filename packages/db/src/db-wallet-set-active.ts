import type { Database } from './database.ts'
import { dbAccountFindMany } from './db-account-find-many.ts'
import { dbSettingSetValue } from './db-setting-set-value.ts'
import { dbWalletFindUnique } from './db-wallet-find-unique.ts'

export async function dbWalletSetActive(db: Database, id: string) {
  return db.transaction('rw', db.wallets, db.settings, db.accounts, async () => {
    const found = await dbWalletFindUnique(db, id)
    if (!found) {
      // TODO: Use Effect
      throw new Error(`Wallet with id ${id} not found`)
    }
    const walletId = found.id

    // set the `activeWalletId` setting to the new value
    await dbSettingSetValue(db, 'activeWalletId', walletId)

    // get the list of accounts for `activeWalletId`
    const accounts = await dbAccountFindMany(db, { walletId })
    const first = accounts[0]
    if (!first) {
      console.warn(`There are no accounts in wallet ${walletId}`)
      return
    }
    // set the `activeAccountId` setting to the first one of the list of accounts
    await dbSettingSetValue(db, 'activeAccountId', first.id)
  })
}
