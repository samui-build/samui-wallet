import { z } from 'zod'

import { settingKeySchema } from './setting-key-schema.ts'

export const settingSchema = z.object({
  createdAt: z.date(),
  id: z.string(),
  key: settingKeySchema,
  updatedAt: z.date(),
  value: z.string(),
})
