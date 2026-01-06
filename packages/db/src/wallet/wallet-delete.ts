import { tryCatch } from '@workspace/core/try-catch'
import { accountFindMany } from '../account/account-find-many.ts'
import { accountFindUnique } from '../account/account-find-unique.ts'
import type { Database } from '../database.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function walletDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.accounts, db.settings, db.wallets, async () => {
    const activeAccountId = (await settingFindUnique(db, 'activeAccountId'))?.value
    if (!activeAccountId) {
      throw new Error('No active account set.')
    }
    const activeAccount = await accountFindUnique(db, activeAccountId)
    if (id === activeAccount?.walletId) {
      throw new Error('You cannot delete the active wallet. Please change wallets and try again.')
    }
    const accounts = await accountFindMany(db, { walletId: id })
    const { error: errorAccounts } = await tryCatch(db.accounts.bulkDelete(accounts.map((account) => account.id)))
    if (errorAccounts) {
      console.log(errorAccounts)
      throw new Error(`Error deleting accounts for wallet with id ${id}`)
    }
    const { data, error } = await tryCatch(db.wallets.delete(id))
    if (error) {
      console.log(error)
      throw new Error(`Error deleting wallet with id ${id}`)
    }
    return data
  })
}
