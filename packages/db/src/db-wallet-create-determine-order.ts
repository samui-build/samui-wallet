import { Effect } from 'effect'

import type { Database } from './database.ts'

export async function dbWalletCreateDetermineOrder(db: Database): Promise<number> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error finding last wallet`)
    },
    try: () => db.wallets.orderBy('order').last(),
  })
  const data = await Effect.runPromise(result)

  if (!data) {
    return 0
  }
  return data.order + 1
}
