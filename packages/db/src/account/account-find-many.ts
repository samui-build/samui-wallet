import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { AppContext } from '../app-context.ts'
import type { Account } from './account.ts'
import type { AccountFindManyInput } from './account-find-many-input.ts'
import { accountFindManySchema } from './account-find-many-schema.ts'

export async function accountFindMany(ctx: AppContext, input: AccountFindManyInput = {}): Promise<Account[]> {
  const parsedInput = accountFindManySchema.parse(input)
  return ctx.db.transaction('r', ctx.db.accounts, async () => {
    return tryCatchOrThrow(
      ctx.db.accounts
        .orderBy('order')
        .filter((item) => {
          const matchWalletId = !parsedInput.walletId || item.walletId === parsedInput.walletId
          const matchId = !parsedInput.id || item.id === parsedInput.id
          const matchName = !parsedInput.name || item.name.includes(parsedInput.name)
          const matchPublicKey = !parsedInput.publicKey || item.publicKey === parsedInput.publicKey
          const matchType = !parsedInput.type || item.type === parsedInput.type

          return matchWalletId && matchId && matchName && matchPublicKey && matchType
        })
        .toArray(),
      `Error finding accounts for wallet id ${parsedInput.walletId}`,
    )
  })
}
