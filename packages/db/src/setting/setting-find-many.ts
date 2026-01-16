import { Result } from '@workspace/core/result'
import type { Database } from '../database.ts'
import type { Setting } from './setting.ts'
import type { SettingFindManyInput } from './setting-find-many-input.ts'
import { settingFindManySchema } from './setting-find-many-schema.ts'

export async function settingFindMany(db: Database, input: SettingFindManyInput = {}): Promise<Setting[]> {
  const parsedInput = settingFindManySchema.parse(input)
  return db.transaction('r', db.settings, async () => {
    const result = await Result.tryPromise(() =>
      db.settings
        .orderBy('key')
        .filter((item) => {
          const matchKey = !parsedInput.key || item.key === parsedInput.key
          const matchValue = !parsedInput.value || item.value === parsedInput.value

          return matchKey && matchValue
        })
        .toArray(),
    )
    if (Result.isError(result)) {
      console.log(result.error)
      throw new Error(`Error finding settings`)
    }
    return result.value
  })
}
