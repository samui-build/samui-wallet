import type { z } from 'zod'

import type { accountTypeSchema } from './account-type-schema.ts'

export type AccountType = z.infer<typeof accountTypeSchema>
