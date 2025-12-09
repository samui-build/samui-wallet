import { tryCatch } from '@workspace/core/try-catch'
import type { Database } from '../database.ts'
import type { Setting } from './setting.ts'
import type { SettingFindManyInput } from './setting-find-many-input.ts'
import { settingFindManySchema } from './setting-find-many-schema.ts'

export async function settingFindMany(db: Database, input: SettingFindManyInput = {}): Promise<Setting[]> {
  const parsedInput = settingFindManySchema.parse(input)
  const { data, error } = await tryCatch(
    db.settings
      .orderBy('key')
      .filter((item) => {
        const matchKey = !parsedInput.key || item.key === parsedInput.key
        const matchValue = !parsedInput.value || item.value === parsedInput.value

        return matchKey && matchValue
      })
      .toArray(),
  )
  if (error) {
    console.log(error)
    throw new Error(`Error finding settings`)
  }
  return data
}
