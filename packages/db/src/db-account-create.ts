import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { Account } from './entity/account'

export type DbAccountCreateInput = Omit<Account, 'createdAt' | 'id' | 'updatedAt'>

export async function dbAccountCreate(db: Database, input: DbAccountCreateInput): Promise<string> {
  const now = new Date()
  const { data, error } = await tryCatch(
    db.accounts.add({
      ...input,
      createdAt: now,
      id: crypto.randomUUID(),
      updatedAt: now,
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error creating account`)
  }
  return data
}
