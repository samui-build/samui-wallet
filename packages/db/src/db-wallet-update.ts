import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { WalletInputUpdate } from './dto/wallet-input-update.ts'

import { parseStrict } from './parse-strict.ts'
import { walletSchemaUpdate } from './schema/wallet-schema-update.ts'

export async function dbWalletUpdate(db: Database, id: string, input: WalletInputUpdate): Promise<number> {
  const parsedInput = parseStrict(walletSchemaUpdate.parse(input))
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error updating wallet with id ${id}`)
    },
    try: () =>
      db.wallets.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
  })
  const data = await Effect.runPromise(result)

  return data
}
