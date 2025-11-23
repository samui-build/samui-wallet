import type { z } from 'zod'

import type { networkSchema } from './network-schema.ts'

export type Network = z.infer<typeof networkSchema>
