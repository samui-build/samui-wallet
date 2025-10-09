import { tryCatch } from '@workspace/core/try-catch'
import type { Db } from './db'
import { Account } from './entity/account'

export type DbAccountCreateInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>

export async function dbAccountCreate(db: Db, input: DbAccountCreateInput): Promise<string> {
  const now = new Date()
  const { data, error } = await tryCatch(
    db.accounts.add({
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error creating account`)
  }
  return data
}
