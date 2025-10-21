import type { Database } from './database'
import type { PreferenceKey } from './entity/preference-key'

import { dbPreferenceFindUniqueByKey } from './db-preference-find-unique-by-key'
import { dbPreferenceSetValue } from './db-preference-set-value'
import { dbWalletFindUnique } from './db-wallet-find-unique'

export async function dbWalletSetActive(db: Database, id: string) {
  return db.transaction('rw', db.accounts, db.preferences, db.wallets, async () => {
    // get the requested wallet from the database
    const found = await dbWalletFindUnique(db, id)
    if (!found) {
      // TODO: Use Effect
      throw new Error(`Wallet with id ${id} not found`)
    }
    const walletId = found.id

    // // set the `activeWalletId` preference to the new value
    const keyAccount: PreferenceKey = 'activeAccountId'
    const keyWallet: PreferenceKey = 'activeWalletId'
    // get the `activeAccountId` preference
    const activeAccount = await dbPreferenceFindUniqueByKey(db, keyAccount)

    // ensure that the request `Wallet.accountId` is equal to `activeAccountId`
    if (found.accountId !== activeAccount?.value) {
      await dbPreferenceSetValue(db, keyAccount, found.accountId)
    }

    await dbPreferenceSetValue(db, keyWallet, walletId)
  })
}
