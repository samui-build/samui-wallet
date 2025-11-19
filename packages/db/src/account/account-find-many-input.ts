import type { z } from 'zod'

import type { accountFindManySchema } from './account-find-many-schema.ts'

export type AccountFindManyInput = z.infer<typeof accountFindManySchema>
