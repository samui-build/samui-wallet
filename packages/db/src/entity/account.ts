import type { z } from 'zod'

import type { accountSchema } from '../schema/account-schema.ts'

export type Account = z.infer<typeof accountSchema>
