import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { Preference } from './entity/preference.ts'
import type { PreferenceKey } from './entity/preference-key.ts'

export async function dbPreferenceFindUniqueByKey(db: Database, key: PreferenceKey): Promise<null | Preference> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error finding preference with key ${key}`)
    },
    try: () => db.preferences.get({ key }),
  })
  const data = await Effect.runPromise(result)

  return data ?? null
}
