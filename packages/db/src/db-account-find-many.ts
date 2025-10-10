import { tryCatch } from '@workspace/core/try-catch'

import type { Db } from './db'
import type { Account } from './entity/account'

export type DbAccountFindManyInput = Partial<Pick<Account, 'id' | 'name'>>

export async function dbAccountFindMany(db: Db, input: DbAccountFindManyInput = {}): Promise<Account[]> {
  const { data, error } = await tryCatch(db.accounts.toArray())
  if (error) {
    console.log(error)
    throw new Error(`Error finding accounts`)
  }
  return data.filter((item) => {
    const matchId = !input.id || item.id === input.id
    const matchName = !input.name || item.name.includes(input.name)

    return matchName && matchId
  })
}
