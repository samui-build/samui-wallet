import { tryCatch } from '@workspace/core/try-catch'

import type { Database } from './database.ts'
import { dbSettingFindUniqueByKey } from './db-setting-find-unique-by-key.ts'
import type { SettingKey } from './entity/setting-key.ts'
import { settingKeySchema } from './schema/setting-key-schema.ts'

export async function dbSettingSetValue(db: Database, key: SettingKey, value: string): Promise<void> {
  if (!settingKeySchema.safeParse(key).success) {
    throw new Error(`Invalid setting key: ${key}`)
  }
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid setting value: ${value}`)
  }

  return db.transaction('rw', db.settings, async () => {
    const now = new Date()
    const setting = await dbSettingFindUniqueByKey(db, key)
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
