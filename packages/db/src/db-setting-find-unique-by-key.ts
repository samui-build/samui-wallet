import { Effect } from 'effect'

import type { Database } from './database.ts'
import type { Setting } from './entity/setting.ts'
import type { SettingKey } from './entity/setting-key.ts'

export async function dbSettingFindUniqueByKey(db: Database, key: SettingKey): Promise<null | Setting> {
  const result = Effect.tryPromise({
    catch: (error) => {
      console.log(error)
      throw new Error(`Error finding setting with key ${key}`)
    },
    try: () => db.settings.get({ key }),
  })
  const data = await Effect.runPromise(result)
  return data ?? null
}
