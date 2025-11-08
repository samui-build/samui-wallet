import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import type { AccountInputFindMany } from './dto/account-input-find-many.ts'
import type { Account } from './entity/account.ts'

import { accountSchemaFindMany } from './schema/account-schema-find-many.ts'

export async function dbAccountFindMany(db: Database, input: AccountInputFindMany): Promise<Account[]> {
  const parsedInput = accountSchemaFindMany.parse(input)
  const { data, error } = await tryCatch(
    db.accounts
      .orderBy('derivationIndex')
      .filter((item) => {
        const matchWalletId = item.walletId === parsedInput.walletId
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
  return data
}
