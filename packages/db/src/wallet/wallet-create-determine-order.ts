import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'

export async function walletCreateDetermineOrder(db: Database): Promise<number> {
  const { data, error } = await tryCatch(db.wallets.orderBy('order').last())

  if (error) {
    console.log(error)
    throw new Error(`Error finding last wallet`)
  }

  if (!data) {
    return 0
  }
  return data.order + 1
}
