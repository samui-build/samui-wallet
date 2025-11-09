import { Effect } from 'effect'

import type { Database } from './database.ts'

export async function dbWalletDelete(db: Database, id: string): Promise<void> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error deleting wallet with id ${id}`)
    },
    try: () => db.wallets.delete(id),
  })
  const data = await Effect.runPromise(result)

  return data
}
