import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'

export async function accountCreateDetermineOrder(db: Database, walletId: string): Promise<number> {
  return db.transaction('r', db.accounts, async () => {
    const result = await Result.tryPromise(() =>
      db.accounts
        .orderBy('order')
        .and((x) => x.walletId === walletId)
        .last(),
    )

    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding last account`)
    }

    if (!result.value) {
      return 0
    }
    return result.value.order + 1
  })
}
