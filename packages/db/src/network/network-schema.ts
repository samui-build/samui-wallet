import { z } from 'zod'

import { networkTypeSchema } from './network-type-schema.ts'

export const networkSchema = z.object({
  createdAt: z.date(),
  endpoint: z.url({ hostname: z.regexes.hostname, protocol: /^https?$/ }),
  endpointSubscriptions: z
    .url({ hostname: z.regexes.hostname, protocol: /^wss?$/ })
    .or(z.literal(''))
    .optional(),
  id: z.string(),
  name: z.string(),
  type: networkTypeSchema,
  updatedAt: z.date(),
})
