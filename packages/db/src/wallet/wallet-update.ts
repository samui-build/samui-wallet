import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'
import { parseStrict } from '../parse-strict.ts'
import type { WalletUpdateInput } from './wallet-update-input.ts'
import { walletUpdateSchema } from './wallet-update-schema.ts'

export async function walletUpdate(ctx: AppContext, id: string, input: WalletUpdateInput): Promise<number> {
  const parsedInput = parseStrict(walletUpdateSchema.parse(input))
  return ctx.db.transaction('rw', ctx.db.wallets, async () => {
    return tryCatchOrThrow(
      ctx.db.wallets.update(id, {
        ...parsedInput,
        updatedAt: new Date(),
      }),
      `Error updating wallet with id ${id}`,
    )
  })
}
