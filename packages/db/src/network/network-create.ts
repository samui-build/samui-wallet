import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import type { NetworkCreateInput } from './network-create-input.ts'

import { networkCreateSchema } from './network-create-schema.ts'

export async function networkCreate(db: Database, input: NetworkCreateInput): Promise<string> {
  const now = new Date()
  // TODO: Add runtime check to ensure Network.type is valid
  const parsedInput = networkCreateSchema.parse(input)
  const { data, error } = await tryCatch(
    db.networks.add({
      ...parsedInput,
      createdAt: now,
      id: crypto.randomUUID(),
      updatedAt: now,
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error creating network`)
  }
  return data
}
