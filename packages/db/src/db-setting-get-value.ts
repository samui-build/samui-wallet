import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { SettingKey } from './entity/setting-key.ts'

export async function dbSettingGetValue(db: Database, key: SettingKey): Promise<null | string> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error getting setting with key ${key}`)
    },
    try: () => db.settings.get({ key }),
  })
  const data = await Effect.runPromise(result)

  return data?.value ?? null
}
