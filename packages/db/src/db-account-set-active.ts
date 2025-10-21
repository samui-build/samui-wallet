import type { Database } from './database'

import { dbAccountFindUnique } from './db-account-find-unique'
import { dbPreferenceSetValue } from './db-preference-set-value'
import { dbWalletFindMany } from './db-wallet-find-many'

export async function dbAccountSetActive(db: Database, id: string) {
  return db.transaction('rw', db.accounts, db.preferences, db.wallets, async () => {
    const found = await dbAccountFindUnique(db, id)
    if (!found) {
      // TODO: Use Effect
      throw new Error(`Account with id ${id} not found`)
    }
    const accountId = found.id

    // set the `activeAccountId` preference to the new value
    await dbPreferenceSetValue(db, 'activeAccountId', accountId)

    // get the list of wallets for `activeAccountId`
    const wallets = await dbWalletFindMany(db, { accountId })
    const first = wallets[0]
    if (!first) {
      console.warn(`There are no wallets in account ${accountId}`)
      return
    }
    // set the `activeWalletId` preference to the first one of the list of wallets
    await dbPreferenceSetValue(db, 'activeWalletId', first.id)
  })
}
