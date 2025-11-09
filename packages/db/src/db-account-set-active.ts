import type { Database } from './database.ts'
import { dbAccountFindUnique } from './db-account-find-unique.ts'
import { dbSettingFindUniqueByKey } from './db-setting-find-unique-by-key.ts'
import { dbSettingSetValue } from './db-setting-set-value.ts'
import type { SettingKey } from './entity/setting-key.ts'

export async function dbAccountSetActive(db: Database, id: string) {
  return db.transaction('rw', db.wallets, db.settings, db.accounts, async () => {
    // get the requested account from the database
    const found = await dbAccountFindUnique(db, id)
    if (!found) {
      // TODO: Use Effect
      throw new Error(`Account with id ${id} not found`)
    }
    const accountId = found.id

    // set the `activeAccountId` setting to the new value
    const keyWallet: SettingKey = 'activeWalletId'
    const keyAccount: SettingKey = 'activeAccountId'
    // get the `activeWalletId` setting
    const activeWallet = await dbSettingFindUniqueByKey(db, keyWallet)

    // ensure that the request `Account.walletId` is equal to `activeWalletId`
    if (found.walletId !== activeWallet?.value) {
      await dbSettingSetValue(db, keyWallet, found.walletId)
    }

    await dbSettingSetValue(db, keyAccount, accountId)
  })
}
