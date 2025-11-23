import type { z } from 'zod'

import type { networkTypeSchema } from './network-type-schema.ts'

export type NetworkType = z.infer<typeof networkTypeSchema>
