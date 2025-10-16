import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { PreferenceInputUpdate } from './dto/preference-input-update'
import type { PreferenceKey } from './entity/preference-key'

import { dbPreferenceFindUniqueByKey } from './db-preference-find-unique-by-key'
import { preferenceSchemaUpdate } from './schema/preference-schema-update'

export async function dbPreferenceUpdateByKey(
  db: Database,
  key: PreferenceKey,
  input: PreferenceInputUpdate,
): Promise<number> {
  const preference = await dbPreferenceFindUniqueByKey(db, key)
  if (!preference) {
    throw new Error(`Error updating preference with key ${key}: not found`)
  }
  const parsedInput = preferenceSchemaUpdate.parse(input)
  if (!Object.keys(parsedInput).length) {
    throw new Error(`Error updating preference with key ${key}: no fields to update`)
  }
  const { data, error } = await tryCatch(
    db.preferences.update(preference?.id, {
      ...parsedInput,
      updatedAt: new Date(),
    }),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error updating preference with key ${key}`)
  }
  return data
}
