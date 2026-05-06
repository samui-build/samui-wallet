import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { Database } from '../database.ts'
import type { Setting } from './setting.ts'
import type { SettingFindManyInput } from './setting-find-many-input.ts'
import { settingFindManySchema } from './setting-find-many-schema.ts'

export async function settingFindMany(db: Database, input: SettingFindManyInput = {}): Promise<Setting[]> {
  const parsedInput = settingFindManySchema.parse(input)
  return db.transaction('r', db.settings, async () => {
    return tryCatchOrThrow(
      db.settings
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
