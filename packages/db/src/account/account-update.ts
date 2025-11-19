import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'
import { parseStrict } from '../parse-strict.ts'
import type { AccountUpdateInput } from './account-update-input.ts'
import { accountUpdateSchema } from './account-update-schema.ts'

export async function accountUpdate(db: Database, id: string, input: AccountUpdateInput): Promise<number> {
  const parsedInput = parseStrict(accountUpdateSchema.parse(input))
  const { data, error } = await tryCatch(
    db.accounts.update(id, {
      ...parsedInput,
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating account with id ${id}`)
  }
  return data
}
