import type { z } from 'zod'

import type { accountSchemaFindMany } from '../schema/account-schema-find-many.ts'

export type AccountInputFindMany = z.infer<typeof accountSchemaFindMany>
