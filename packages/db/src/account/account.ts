import type { z } from 'zod'

import type { accountSchema } from './account-schema.ts'

export type Account = z.infer<typeof accountSchema>
