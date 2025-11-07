import { z } from 'zod'

import { networkTypeSchema } from './network-type-schema.ts'

export const networkSchema = z.object({
  createdAt: z.date(),
  endpoint: z.url(),
  endpointSubscriptions: z.url().optional(),
  id: z.string(),
  name: z.string(),
  type: networkTypeSchema,
  updatedAt: z.date(),
})
