import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'
import { randomId } from '../random-id.ts'
import { settingFindUnique } from './setting-find-unique.ts'
import type { SettingKey } from './setting-key.ts'
import { settingKeySchema } from './setting-key-schema.ts'

export async function settingSetValue(ctx: AppContext, key: SettingKey, value: string): Promise<void> {
  if (!settingKeySchema.safeParse(key).success) {
    throw new Error(`Invalid setting key: ${key}`)
  }
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid setting value: ${value}`)
  }

  return ctx.db.transaction('rw', ctx.db.settings, async () => {
    const now = new Date()
    const setting = await settingFindUnique(ctx, key)
    // Update the setting if it's already set
    if (setting) {
      await tryCatchOrThrow(ctx.db.settings.update(setting.id, { updatedAt: now, value }), `Error updating setting`)
      return
    }
    // Create the setting if it's not set
    await tryCatchOrThrow(
      ctx.db.settings.add({ createdAt: now, id: randomId(), key, updatedAt: now, value }),
      `Error creating setting`,
    )
    return
  })
}
