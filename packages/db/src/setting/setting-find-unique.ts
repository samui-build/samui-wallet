import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { Database } from '../database.ts'
import type { Setting } from './setting.ts'
import type { SettingKey } from './setting-key.ts'

export async function settingFindUnique(db: Database, key: SettingKey): Promise<null | Setting> {
  return db.transaction('r', db.settings, async () => {
    const data = await tryCatchOrThrow(db.settings.get({ key }), `Error finding setting with key ${key}`)
    return data ?? null
  })
}
