import { z } from 'zod'

import { preferenceKeySchema } from './preference-key-schema.ts'

export const preferenceSchema = z.object({
  createdAt: z.date(),
  id: z.string(),
  key: preferenceKeySchema,
  updatedAt: z.date(),
  value: z.string(),
})
