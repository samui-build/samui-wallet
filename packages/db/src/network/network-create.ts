import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'
import { randomId } from '../random-id.ts'
import type { NetworkCreateInput } from './network-create-input.ts'
import { networkCreateSchema } from './network-create-schema.ts'

export async function networkCreate(db: Database, input: NetworkCreateInput): Promise<string> {
  const now = new Date()
  const parsedInput = networkCreateSchema.parse(input)

  return db.transaction('rw', db.networks, async () => {
    return tryCatchOrThrow(
      db.networks.add({
        ...parsedInput,
        createdAt: now,
        id: randomId(),
        updatedAt: now,
      }),
      `Error creating network`,
    )
  })
}
