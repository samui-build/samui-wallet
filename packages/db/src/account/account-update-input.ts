import type { z } from 'zod'

import type { accountUpdateSchema } from './account-update-schema.ts'

export type AccountUpdateInput = z.infer<typeof accountUpdateSchema>
