import { Effect } from 'effect'

import type { Database } from './database.ts'
import { dbPreferenceGetValue } from './db-preference-get-value.ts'
import { dbPreferenceSetValue } from './db-preference-set-value.ts'
import type { WalletInputCreate } from './dto/wallet-input-create.ts'
import { walletSchemaCreate } from './schema/wallet-schema-create.ts'

export async function dbWalletCreate(db: Database, input: WalletInputCreate): Promise<string> {
  const now = new Date()
  const parsedInput = walletSchemaCreate.parse(input)

  const result = Effect.tryPromise({
    catch: () => new Error(`Error creating wallet`),
    try: () =>
      db.wallets.add({
        ...parsedInput,
        createdAt: now,
        derivationIndex: parsedInput.derivationIndex ?? 0,
        id: crypto.randomUUID(),
        updatedAt: now,
      }),
  })
  const data = await Effect.runPromise(result)

  const activeWalletId = await dbPreferenceGetValue(db, 'activeWalletId')
  if (!activeWalletId) {
    await dbPreferenceSetValue(db, 'activeWalletId', data)
  }

  return data
}
