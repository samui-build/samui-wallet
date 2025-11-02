import type { z } from 'zod'

import type { accountSchemaUpdate } from '../schema/account-schema-update.js'

export type AccountInputUpdate = z.infer<typeof accountSchemaUpdate>
