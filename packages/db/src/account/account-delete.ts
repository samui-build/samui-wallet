import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function accountDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.accounts, db.settings, async () => {
    const activeAccountId = (await settingFindUnique(db, 'activeAccountId'))?.value
    if (id === activeAccountId) {
      throw new Error('You cannot delete the active account. Please change accounts and try again.')
    }

    const { data, error } = await tryCatch(db.accounts.delete(id))
    if (error) {
      console.log(error)
      throw new Error(`Error deleting account with id ${id}`)
    }
    return data
  })
}
