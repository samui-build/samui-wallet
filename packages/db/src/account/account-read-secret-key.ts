import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { DbContext } from '../db-context.ts'

export function accountReadSecretKey(ctx: DbContext, id: string) {
  return ctx.db.transaction('r', ctx.db.accounts, async () => {
    const account = await tryCatchOrThrow(
      ctx.db.accounts.where('id').equals(id).raw().first(),
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
