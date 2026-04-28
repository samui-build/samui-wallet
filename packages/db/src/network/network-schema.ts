import { z } from 'zod'
import { colorSchema } from '../color-schema.ts'
import { networkTypeSchema } from './network-type-schema.ts'

export const networkSchema = z.object({
  color: colorSchema.optional(),
  createdAt: z.date(),
  endpoint: z.url({ hostname: z.regexes.hostname, protocol: /^https?$/ }),
  endpointSubscriptions: z
    .url({ hostname: z.regexes.hostname, protocol: /^wss?$/ })
    .or(z.literal(''))
    .optional(),
  id: z.string(),
  name: z.string().trim().min(1).max(20),
  type: networkTypeSchema,
  updatedAt: z.date(),
})
