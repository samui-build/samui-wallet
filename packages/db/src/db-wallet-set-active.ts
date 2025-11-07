import type { Database } from './database.ts'
import { dbSettingFindUniqueByKey } from './db-setting-find-unique-by-key.ts'
import { dbSettingSetValue } from './db-setting-set-value.ts'
import { dbWalletFindUnique } from './db-wallet-find-unique.ts'
import type { SettingKey } from './entity/setting-key.ts'

export async function dbWalletSetActive(db: Database, id: string) {
  return db.transaction('rw', db.accounts, db.settings, db.wallets, async () => {
    // get the requested wallet from the database
    const found = await dbWalletFindUnique(db, id)
    if (!found) {
      // TODO: Use Effect
      throw new Error(`Wallet with id ${id} not found`)
    }
    const walletId = found.id

    // set the `activeWalletId` setting to the new value
    const keyAccount: SettingKey = 'activeAccountId'
    const keyWallet: SettingKey = 'activeWalletId'
    // get the `activeAccountId` setting
    const activeAccount = await dbSettingFindUniqueByKey(db, keyAccount)

    // ensure that the request `Wallet.accountId` is equal to `activeAccountId`
    if (found.accountId !== activeAccount?.value) {
      await dbSettingSetValue(db, keyAccount, found.accountId)
    }

    await dbSettingSetValue(db, keyWallet, walletId)
  })
}
