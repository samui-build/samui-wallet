import { Result } from '@workspace/core/result'
import type { Database } from '../database.ts'
import type { Account } from './account.ts'
import { accountSanitizer } from './account-sanitizer.ts'

export async function accountFindUnique(db: Database, id: string): Promise<null | Account> {
  return db.transaction('r', db.accounts, async () => {
    const result = await Result.tryPromise(() => db.accounts.get(id))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding account with id ${id}`)
    }
    return result.value ? accountSanitizer(result.value) : null
  })
}
