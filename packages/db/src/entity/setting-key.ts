import type { z } from 'zod'

import type { settingKeySchema } from '../schema/setting-key-schema.ts'

export type SettingKey = z.infer<typeof settingKeySchema>
