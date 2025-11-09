import { Effect } from 'effect'

import type { Database } from './database.ts'
import { dbPreferenceFindUniqueByKey } from './db-preference-find-unique-by-key.ts'
import type { PreferenceKey } from './entity/preference-key.ts'
import { preferenceKeySchema } from './schema/preference-key-schema.ts'

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
      await Effect.runPromise(
        Effect.tryPromise({
          catch: () => new Error(`Error updating preference`),
          try: () => db.preferences.update(preference.id, { updatedAt: now, value }),
        }),
      )
      return
    }
    // Create the preference if it's not set
    await Effect.runPromise(
      Effect.tryPromise({
        catch: () => new Error(`Error creating preference`),
        try: () => db.preferences.add({ createdAt: now, id: crypto.randomUUID(), key, updatedAt: now, value }),
      }),
    )
    return
  })
}
