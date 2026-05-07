import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { AppContext } from '../app-context.ts'
import type { Account } from './account.ts'

export async function accountFindUnique(ctx: AppContext, id: string): Promise<null | Account> {
  return ctx.db.transaction('r', ctx.db.accounts, async () => {
    const data = await tryCatchOrThrow(ctx.db.accounts.get(id), `Error finding account with id ${id}`)
    return data ?? null
  })
}
