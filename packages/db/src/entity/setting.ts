import type { z } from 'zod'

import type { settingSchema } from '../schema/setting-schema.ts'

export type Setting = z.infer<typeof settingSchema>
