import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'

export function accountReadSecretKey(db: Database, id: string) {
  return db.transaction('r', db.accounts, async () => {
    const { data: account, error } = await tryCatch(db.accounts.get(id))
    if (error) {
      console.log(error)
      throw new Error(`Error finding account with id ${id}`)
    }
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
