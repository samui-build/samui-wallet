import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import type { SettingKey } from './setting-key.ts'

export async function settingGetValue(db: Database, key: SettingKey): Promise<null | string> {
  const { data, error } = await tryCatch(db.settings.get({ key }))
  if (error) {
    console.log(error)
    throw new Error(`Error getting setting with key ${key}`)
  }
  return data?.value ?? null
}
