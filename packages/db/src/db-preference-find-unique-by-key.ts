import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import type { Preference } from './entity/preference.ts'
import type { PreferenceKey } from './entity/preference-key.ts'

export async function dbPreferenceFindUniqueByKey(db: Database, key: PreferenceKey): Promise<null | Preference> {
  const { data, error } = await tryCatch(db.preferences.get({ key }))
  if (error) {
    console.log(error)
    throw new Error(`Error finding preference with key ${key}`)
  }
  return data ?? null
}
