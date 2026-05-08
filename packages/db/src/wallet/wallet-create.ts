import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { DbContext } from '../db-context.ts'
import { randomId } from '../random-id.ts'
import { walletCreateDetermineOrder } from './wallet-create-determine-order.ts'
import type { WalletCreateInput } from './wallet-create-input.ts'
import { walletCreateSchema } from './wallet-create-schema.ts'

export async function walletCreate(ctx: DbContext, input: WalletCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = walletCreateSchema.parse(input)

  return ctx.db.transaction('rw', ctx.db.wallets, ctx.db.settings, ctx.db.accounts, async () => {
    const order = await walletCreateDetermineOrder(ctx)

    return tryCatchOrThrow(
      ctx.db.wallets.add({
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
