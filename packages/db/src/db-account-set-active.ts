import type { Database } from './database.ts'

import { dbAccountFindUnique } from './db-account-find-unique.ts'
import { dbSettingSetValue } from './db-setting-set-value.ts'
import { dbWalletFindMany } from './db-wallet-find-many.ts'

export async function dbAccountSetActive(db: Database, id: string) {
  return db.transaction('rw', db.accounts, db.settings, db.wallets, async () => {
    const found = await dbAccountFindUnique(db, id)
    if (!found) {
      // TODO: Use Effect
      throw new Error(`Account with id ${id} not found`)
    }
    const accountId = found.id

    // set the `activeAccountId` setting to the new value
    await dbSettingSetValue(db, 'activeAccountId', accountId)

    // get the list of wallets for `activeAccountId`
    const wallets = await dbWalletFindMany(db, { accountId })
    const first = wallets[0]
    if (!first) {
      console.warn(`There are no wallets in account ${accountId}`)
      return
    }
    // set the `activeWalletId` setting to the first one of the list of wallets
    await dbSettingSetValue(db, 'activeWalletId', first.id)
  })
}
