import type { z } from 'zod'

import type { accountInternalSchema } from './account-internal-schema.ts'

export type AccountInternal = z.infer<typeof accountInternalSchema>
