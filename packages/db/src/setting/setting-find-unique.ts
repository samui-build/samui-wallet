import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import type { Setting } from './setting.ts'
import type { SettingKey } from './setting-key.ts'

export async function settingFindUnique(db: Database, key: SettingKey): Promise<null | Setting> {
  return db.transaction('r', db.settings, async () => {
    const { data, error } = await tryCatch(db.settings.get({ key }))
    if (error) {
      console.log(error)
      throw new Error(`Error finding setting with key ${key}`)
    }
    return data ?? null
  })
}
