import { Result } from '@workspace/core/result'
import type { Database } from '../database.ts'

export function accountReadSecretKey(db: Database, id: string) {
  return db.transaction('r', db.accounts, async () => {
    const result = await Result.tryPromise(() => db.accounts.get(id))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding account with id ${id}`)
    }
    if (!result.value) {
      throw new Error(`Account with id ${id} not found`)
    }
    if (result.value.type === 'Watched') {
      throw new Error(`Account with id ${id} does not have a secret key`)
    }
    // TODO: Decrypt account.secretKey here
    return result.value.secretKey
  })
}
