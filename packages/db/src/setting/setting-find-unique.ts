import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import type { Setting } from './setting.ts'
import type { SettingKey } from './setting-key.ts'

export async function settingFindUnique(db: Database, key: SettingKey): Promise<null | Setting> {
  return db.transaction('r', db.settings, async () => {
    const result = await Result.tryPromise(() => db.settings.get({ key }))
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding setting with key ${key}`)
    }
    return result.value ?? null
  })
}
