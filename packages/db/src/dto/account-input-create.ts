import type { z } from 'zod'

import type { accountSchemaCreate } from '../schema/account-schema-create'

export type AccountInputCreate = z.infer<typeof accountSchemaCreate>
