import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { PreferenceKey } from './entity/preference-key.ts'

export async function dbPreferenceGetValue(db: Database, key: PreferenceKey): Promise<null | string> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error getting preference with key ${key}`)
    },
    try: () => db.preferences.get({ key }),
  })
  const data = await Effect.runPromise(result)

  return data?.value ?? null
}
