import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { AppContext } from '../app-context.ts'
import type { Setting } from './setting.ts'
import type { SettingFindManyInput } from './setting-find-many-input.ts'
import { settingFindManySchema } from './setting-find-many-schema.ts'

export async function settingFindMany(ctx: AppContext, input: SettingFindManyInput = {}): Promise<Setting[]> {
  const parsedInput = settingFindManySchema.parse(input)
  return ctx.db.transaction('r', ctx.db.settings, async () => {
    return tryCatchOrThrow(
      ctx.db.settings
        .orderBy('key')
        .filter((item) => {
          const matchKey = !parsedInput.key || item.key === parsedInput.key
          const matchValue = !parsedInput.value || item.value === parsedInput.value

          return matchKey && matchValue
        })
        .toArray(),
      `Error finding settings`,
    )
  })
}
