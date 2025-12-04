import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'
import { settingGetValue } from '../setting/setting-get-value.ts'
import type { Account } from './account.ts'
import type { AccountFindManyInput } from './account-find-many-input.ts'
import { accountFindManySchema } from './account-find-many-schema.ts'
import { accountSanitizer } from './account-sanitizer.ts'

export async function accountFindMany(db: Database, input: AccountFindManyInput = {}): Promise<Account[]> {
  return db.transaction('r', db.accounts, db.settings, async () => {
    const parsedInput = accountFindManySchema.parse(input)

    const walletId = parsedInput.walletId ?? (await settingGetValue(db, 'activeWalletId'))
    if (!walletId) {
      throw new Error('Cannot find accounts without a walletId.')
    }

    const { data, error } = await tryCatch(
      db.accounts
        .orderBy('derivationIndex')
        .filter((item) => {
          const matchWalletId = item.walletId === parsedInput.walletId || item.walletId === walletId
          const matchId = !parsedInput.id || item.id === parsedInput.id
          const matchName = !parsedInput.name || item.name.includes(parsedInput.name)
          const matchPublicKey = !parsedInput.publicKey || item.publicKey === parsedInput.publicKey
          const matchType = !parsedInput.type || item.type === parsedInput.type

          return matchWalletId && matchId && matchName && matchPublicKey && matchType
        })
        .toArray(),
    )
    if (error) {
      console.log(error)
      throw new Error(`Error finding accounts for wallet id ${parsedInput.walletId}`)
    }
    return data?.map((item) => accountSanitizer(item))
  })
}
