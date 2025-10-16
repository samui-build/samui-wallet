import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { PreferenceInputCreate } from './dto/preference-input-create'

import { preferenceKeySchema } from './schema/preference-key-schema'
import { preferenceSchemaCreate } from './schema/preference-schema-create'

export async function dbPreferenceCreate(db: Database, input: PreferenceInputCreate): Promise<string> {
  const now = new Date()
  // TODO: Add runtime check to ensure key does not already exist in the table.

  const parsedInput = preferenceSchemaCreate.parse(input)
  // Ensure that parsedInput.key exists in the preferenceKeySchema enum
  preferenceKeySchema.parse(parsedInput.key)

  const { data, error } = await tryCatch(
    db.preferences.add({
      ...parsedInput,
      createdAt: now,
      id: crypto.randomUUID(),
      updatedAt: now,
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error creating preference`)
  }
  return data
}
