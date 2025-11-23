import type { Database } from '../database.ts'
import { settingFindUniqueByKey } from '../setting/setting-find-unique-by-key.ts'
import type { SettingKey } from '../setting/setting-key.ts'
import { settingSetValue } from '../setting/setting-set-value.ts'
import { accountFindUnique } from './account-find-unique.ts'

export async function accountSetActive(db: Database, id: string) {
  return db.transaction('rw', db.wallets, db.settings, db.accounts, async () => {
    // get the requested account from the database
    const found = await accountFindUnique(db, id)
    if (!found) {
      // TODO: Use Effect
      throw new Error(`Account with id ${id} not found`)
    }
    const accountId = found.id

    // set the `activeAccountId` setting to the new value
    const keyWallet: SettingKey = 'activeWalletId'
    const keyAccount: SettingKey = 'activeAccountId'
    // get the `activeWalletId` setting
    const activeWallet = await settingFindUniqueByKey(db, keyWallet)

    // ensure that the request `Account.walletId` is equal to `activeWalletId`
    if (found.walletId !== activeWallet?.value) {
      await settingSetValue(db, keyWallet, found.walletId)
    }

    await settingSetValue(db, keyAccount, accountId)
  })
}
