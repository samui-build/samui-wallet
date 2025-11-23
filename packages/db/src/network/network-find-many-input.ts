import type { z } from 'zod'

import type { networkFindManySchema } from './network-find-many-schema.ts'

export type NetworkFindManyInput = z.infer<typeof networkFindManySchema>
