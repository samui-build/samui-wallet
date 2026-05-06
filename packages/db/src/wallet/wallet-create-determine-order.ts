import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'

export async function walletCreateDetermineOrder(db: Database): Promise<number> {
  return db.transaction('r', db.wallets, async () => {
    const data = await tryCatchOrThrow(db.wallets.orderBy('order').last(), `Error finding last wallet`)

    if (!data) {
      return 0
    }
    return data.order + 1
  })
}
