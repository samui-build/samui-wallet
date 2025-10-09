import { tryCatch } from '@workspace/core/try-catch'
import { type Db } from './db'
import { Account } from './entity/account'

export type DbAccountUpdateInput = Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>

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
