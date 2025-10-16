import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { Preference } from './entity/preference'
import type { PreferenceKey } from './entity/preference-key'

export async function dbPreferenceFindUniqueByKey(db: Database, key: PreferenceKey): Promise<null | Preference> {
  const { data, error } = await tryCatch(db.preferences.get({ key }))
  if (error) {
    console.log(error)
    throw new Error(`Error finding preference with key ${key}`)
  }
  return data ? data : null
}
