import { Result } from '@workspace/core/result'
import type { Database } from '../database.ts'
import type { Account } from './account.ts'
import type { AccountFindManyInput } from './account-find-many-input.ts'
import { accountFindManySchema } from './account-find-many-schema.ts'
import { accountSanitizer } from './account-sanitizer.ts'

export async function accountFindMany(db: Database, input: AccountFindManyInput = {}): Promise<Account[]> {
  const parsedInput = accountFindManySchema.parse(input)
  return db.transaction('r', db.accounts, async () => {
    const result = await Result.tryPromise(() =>
      db.accounts
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
    )
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding accounts for wallet id ${parsedInput.walletId}`)
    }
    return result.value?.map((item) => accountSanitizer(item))
  })
}
