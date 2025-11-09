import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { Wallet } from './entity/wallet.ts'

export async function dbWalletFindUnique(db: Database, id: string): Promise<null | Wallet> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error finding wallet with id ${id}`)
    },
    try: () => db.wallets.get(id),
  })
  const data = await Effect.runPromise(result)

  return data ? data : null
}
