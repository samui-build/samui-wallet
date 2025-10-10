import { tryCatch } from '@workspace/core/try-catch'

import type { Account } from './entity/account'

import { type Db } from './db'

export type DbAccountUpdateInput = Partial<Omit<Account, 'createdAt' | 'id' | 'updatedAt'>>

export async function dbAccountUpdate(db: Db, id: string, input: DbAccountUpdateInput): Promise<number> {
  const { data, error } = await tryCatch(
    db.accounts.update(id, {
      ...input,
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating account with id ${id}`)
  }
  return data
}
