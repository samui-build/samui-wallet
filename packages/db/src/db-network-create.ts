import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import type { NetworkInputCreate } from './dto/network-input-create.ts'

import { networkSchemaCreate } from './schema/network-schema-create.ts'

export async function dbNetworkCreate(db: Database, input: NetworkInputCreate): Promise<string> {
  const now = new Date()
  // TODO: Add runtime check to ensure Network.type is valid
  const parsedInput = networkSchemaCreate.parse(input)
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
