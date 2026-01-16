import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'

export async function walletCreateDetermineOrder(db: Database): Promise<number> {
  return db.transaction('r', db.wallets, async () => {
    const result = await Result.tryPromise(() => db.wallets.orderBy('order').last())

    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding last wallet`)
    }

    if (!result.value) {
      return 0
    }
    return result.value.order + 1
  })
}
