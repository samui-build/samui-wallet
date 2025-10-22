import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { PreferenceKey } from './entity/preference-key'

import { dbPreferenceFindUniqueByKey } from './db-preference-find-unique-by-key'
import { preferenceKeySchema } from './schema/preference-key-schema'

export async function dbPreferenceSetValue(db: Database, key: PreferenceKey, value: string): Promise<void> {
  if (!preferenceKeySchema.safeParse(key).success) {
    throw new Error(`Invalid preference key: ${key}`)
  }
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid preference value: ${value}`)
  }

  return db.transaction('rw', db.preferences, async () => {
    const now = new Date()
    const preference = await dbPreferenceFindUniqueByKey(db, key)
    // Update the preference if it's already set
    if (preference) {
      const { error } = await tryCatch(db.preferences.update(preference.id, { updatedAt: now, value }))
      if (error) {
        throw new Error(`Error updating preference`)
      }
      return
    }
    // Create the preference if it's not set
    const { error } = await tryCatch(
      db.preferences.add({ createdAt: now, id: crypto.randomUUID(), key, updatedAt: now, value }),
    )
    if (error) {
      throw new Error(`Error creating preference`)
    }
    return
  })
}
