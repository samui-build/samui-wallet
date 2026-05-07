import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'

import type { AppContext } from '../app-context.ts'
import type { Setting } from './setting.ts'
import type { SettingKey } from './setting-key.ts'

export async function settingFindUnique(ctx: AppContext, key: SettingKey): Promise<null | Setting> {
  return ctx.db.transaction('r', ctx.db.settings, async () => {
    const data = await tryCatchOrThrow(ctx.db.settings.get({ key }), `Error finding setting with key ${key}`)
    return data ?? null
  })
}
