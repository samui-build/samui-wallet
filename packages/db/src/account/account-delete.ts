import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import { settingFindUnique } from '../setting/setting-find-unique.ts'

export async function accountDelete(db: Database, id: string): Promise<void> {
  return db.transaction('rw', db.accounts, db.settings, async () => {
    const activeAccountId = (await settingFindUnique(db, 'activeAccountId'))?.value
    if (id === activeAccountId) {
      throw new Error('You cannot delete the active account. Please change accounts and try again.')
    }

    const result = await Result.tryPromise(() => db.accounts.delete(id))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error deleting account with id ${id}`)
    }
    return result.value
  })
}
