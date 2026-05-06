import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function accountDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.accounts, db.settings, async () => {
    const activeAccountId = (await settingFindUnique(db, 'activeAccountId'))?.value
    if (id === activeAccountId) {
      throw new Error('You cannot delete the active account. Please change accounts and try again.')
    }

    return tryCatchOrThrow(db.accounts.delete(id), `Error deleting account with id ${id}`)
  })
}
