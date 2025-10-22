import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database'
import type { PreferenceKey } from './entity/preference-key'

export async function dbPreferenceGetValue(db: Database, key: PreferenceKey): Promise<null | string> {
  const { data, error } = await tryCatch(db.preferences.get({ key }))
  if (error) {
    console.log(error)
    throw new Error(`Error getting preference with key ${key}`)
  }
  return data?.value ?? null
}
