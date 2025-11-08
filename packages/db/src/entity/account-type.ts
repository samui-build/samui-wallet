import type { z } from 'zod'

import type { accountTypeSchema } from '../schema/account-type-schema.ts'

export type AccountType = z.infer<typeof accountTypeSchema>
