import type { z } from 'zod'

import type { settingFindManySchema } from './setting-find-many-schema.ts'

export type SettingFindManyInput = z.infer<typeof settingFindManySchema>
