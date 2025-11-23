import type { z } from 'zod'

import type { networkUpdateSchema } from './network-update-schema.ts'

export type NetworkUpdateInput = z.infer<typeof networkUpdateSchema>
