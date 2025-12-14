import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import { randomId } from '../random-id.ts'
import type { NetworkCreateInput } from './network-create-input.ts'
import { networkCreateSchema } from './network-create-schema.ts'

export async function networkCreate(db: Database, input: NetworkCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = networkCreateSchema.parse(input)

  return db.transaction('rw', db.networks, async () => {
    const { data, error } = await tryCatch(
      db.networks.add({
        ...parsedInput,
        createdAt: now,
        id: randomId(),
        updatedAt: now,
      }),
    )
    if (error) {
      console.log(error)
      throw new Error(`Error creating network`)
    }
    return data
  })
}
