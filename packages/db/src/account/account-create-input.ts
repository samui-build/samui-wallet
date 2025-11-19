import type { z } from 'zod'

import type { accountCreateSchema } from './account-create-schema.ts'

export type AccountCreateInput = z.infer<typeof accountCreateSchema>
