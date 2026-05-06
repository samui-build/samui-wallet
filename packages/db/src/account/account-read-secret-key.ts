import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { Database } from '../database.ts'

export function accountReadSecretKey(db: Database, id: string) {
  return db.transaction('r', db.accounts, async () => {
    const account = await tryCatchOrThrow(
      db.accounts.where('id').equals(id).raw().first(),
      `Error finding account with id ${id}`,
    )
    if (!account) {
      throw new Error(`Account with id ${id} not found`)
    }
    if (account.type === 'Watched') {
      throw new Error(`Account with id ${id} does not have a secret key`)
    }
    // TODO: Decrypt account.secretKey here
    return account.secretKey
  })
}
