import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'

export async function accountCreateDetermineOrder(ctx: AppContext, walletId: string): Promise<number> {
  return ctx.db.transaction('r', ctx.db.accounts, async () => {
    const data = await tryCatchOrThrow(
      ctx.db.accounts
        .orderBy('order')
        .and((x) => x.walletId === walletId)
        .last(),
      `Error finding last account`,
    )

    if (!data) {
      return 0
    }
    return data.order + 1
  })
}
