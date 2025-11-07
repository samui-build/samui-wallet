import type { z } from 'zod'

import type { networkSchema } from '../schema/network-schema.ts'

export type Network = z.infer<typeof networkSchema>
