import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'
import { randomId } from '../random-id.ts'
import { walletCreateDetermineOrder } from './wallet-create-determine-order.ts'
import type { WalletCreateInput } from './wallet-create-input.ts'
import { walletCreateSchema } from './wallet-create-schema.ts'

export async function walletCreate(db: Database, input: WalletCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = walletCreateSchema.parse(input)

  return db.transaction('rw', db.wallets, db.settings, db.accounts, async () => {
    const order = await walletCreateDetermineOrder(db)

    return tryCatchOrThrow(
      db.wallets.add({
        ...parsedInput,
        accounts: [],
        createdAt: now,
        id: randomId(),
        order,
        updatedAt: now,
      }),
      `Error creating wallet`,
    )
  })
}
