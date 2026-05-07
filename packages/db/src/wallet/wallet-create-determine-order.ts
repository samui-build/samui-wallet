import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'

export async function walletCreateDetermineOrder(ctx: AppContext): Promise<number> {
  return ctx.db.transaction('r', ctx.db.wallets, async () => {
    const data = await tryCatchOrThrow(ctx.db.wallets.orderBy('order').last(), `Error finding last wallet`)

    if (!data) {
      return 0
    }
    return data.order + 1
  })
}
