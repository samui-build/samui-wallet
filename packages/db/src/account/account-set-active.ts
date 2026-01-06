import type { Database } from '../database.ts'
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

    await settingSetValue(db, 'activeAccountId', accountId)
  })
}
