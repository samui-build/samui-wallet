import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'

export async function dbAccountCreateDetermineOrder(db: Database, walletId: string): Promise<number> {
  const { data, error } = await tryCatch(
    db.accounts
      .orderBy('order')
      .and((x) => x.walletId === walletId)
      .last(),
  )

  if (error) {
    console.log(error)
    throw new Error(`Error finding last account`)
  }

  if (!data) {
    return 0
  }
  return data.order + 1
}
