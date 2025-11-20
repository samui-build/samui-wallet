import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from '../database.ts'
import { settingFindUniqueByKey } from './setting-find-unique-by-key.ts'
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
    const setting = await settingFindUniqueByKey(db, key)
    // Update the setting if it's already set
    if (setting) {
      const { error } = await tryCatch(db.settings.update(setting.id, { updatedAt: now, value }))
      if (error) {
        throw new Error(`Error updating setting`)
      }
      return
    }
    // Create the setting if it's not set
    const { error } = await tryCatch(
      db.settings.add({ createdAt: now, id: crypto.randomUUID(), key, updatedAt: now, value }),
    )
    if (error) {
      throw new Error(`Error creating setting`)
    }
    return
  })
}
