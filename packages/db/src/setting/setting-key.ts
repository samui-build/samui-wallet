import type { z } from 'zod'

import type { settingKeySchema } from './setting-key-schema.ts'

export type SettingKey = z.infer<typeof settingKeySchema>
