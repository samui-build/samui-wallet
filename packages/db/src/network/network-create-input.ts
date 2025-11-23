import type { z } from 'zod'

import type { networkCreateSchema } from './network-create-schema.ts'

export type NetworkCreateInput = z.infer<typeof networkCreateSchema>
