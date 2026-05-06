import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'

export async function accountCreateDetermineOrder(db: Database, walletId: string): Promise<number> {
  return db.transaction('r', db.accounts, async () => {
    const data = await tryCatchOrThrow(
      db.accounts
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
