import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { DbContext } from '../db-context.ts'
import type { Wallet } from './wallet.ts'

export async function walletFindUnique(ctx: DbContext, id: string): Promise<Wallet | null> {
  return ctx.db.transaction('r', ctx.db.wallets, async () => {
    const data = await tryCatchOrThrow(ctx.db.wallets.get(id), `Error finding wallet with id ${id}`)
    return data ?? null
  })
}
