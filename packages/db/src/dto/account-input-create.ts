import type { z } from 'zod'

import type { accountSchemaCreate } from '../schema/account-schema-create.js'

export type AccountInputCreate = z.infer<typeof accountSchemaCreate>
