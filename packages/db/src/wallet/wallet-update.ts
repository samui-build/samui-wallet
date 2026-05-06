import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'
import { parseStrict } from '../parse-strict.ts'
import type { WalletUpdateInput } from './wallet-update-input.ts'
import { walletUpdateSchema } from './wallet-update-schema.ts'

export async function walletUpdate(db: Database, id: string, input: WalletUpdateInput): Promise<number> {
  const parsedInput = parseStrict(walletUpdateSchema.parse(input))
  return db.transaction('rw', db.wallets, async () => {
    return tryCatchOrThrow(
      db.wallets.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
      `Error updating wallet with id ${id}`,
    )
  })
}
