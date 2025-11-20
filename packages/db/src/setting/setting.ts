import type { z } from 'zod'

import type { settingSchema } from './setting-schema.ts'

export type Setting = z.infer<typeof settingSchema>
