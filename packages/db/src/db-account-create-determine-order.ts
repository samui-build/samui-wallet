import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'

export async function dbAccountCreateDetermineOrder(db: Database): Promise<number> {
  const { data, error } = await tryCatch(db.accounts.orderBy('order').last())

  if (error) {
    console.log(error)
    throw new Error(`Error finding last account`)
  }

  if (!data) {
    return 0
  }
  return data.order + 1
}
