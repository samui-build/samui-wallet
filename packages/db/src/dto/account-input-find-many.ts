import type { z } from 'zod'

import type { accountSchemaFindMany } from '../schema/account-schema-find-many'

export type AccountInputFindMany = z.infer<typeof accountSchemaFindMany>
