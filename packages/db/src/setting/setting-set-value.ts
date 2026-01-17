import { Result } from '@workspace/core/result'

import type { Database } from '../database.ts'
import { randomId } from '../random-id.ts'
import { settingFindUnique } from './setting-find-unique.ts'
import type { SettingKey } from './setting-key.ts'
import { settingKeySchema } from './setting-key-schema.ts'

export async function settingSetValue(db: Database, key: SettingKey, value: string): Promise<void> {
  if (!settingKeySchema.safeParse(key).success) {
    throw new Error(`Invalid setting key: ${key}`)
  }
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid setting value: ${value}`)
  }

  return db.transaction('rw', db.settings, async () => {
    const now = new Date()
    const setting = await settingFindUnique(db, key)
    // Update the setting if it's already set
    if (setting) {
      const result = await Result.tryPromise(() => db.settings.update(setting.id, { updatedAt: now, value }))
      if (Result.isError(result)) {
        throw new Error(`Error updating setting`)
      }
      return
    }
    // Create the setting if it's not set
    const result = await Result.tryPromise(() =>
      db.settings.add({ createdAt: now, id: randomId(), key, updatedAt: now, value }),
    )
    if (Result.isError(result)) {
      throw new Error(`Error creating setting`)
    }
    return
  })
}
