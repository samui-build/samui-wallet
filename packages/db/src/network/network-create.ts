import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import { randomId } from '../random-id.ts'
import type { NetworkCreateInput } from './network-create-input.ts'
import { networkCreateSchema } from './network-create-schema.ts'

export async function networkCreate(db: Database, input: NetworkCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = networkCreateSchema.parse(input)

  return db.transaction('rw', db.networks, async () => {
    const result = await Result.tryPromise(() =>
      db.networks.add({
        ...parsedInput,
        createdAt: now,
        id: randomId(),
        updatedAt: now,
      }),
    )
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error creating network`)
    }
    return result.value
  })
}
