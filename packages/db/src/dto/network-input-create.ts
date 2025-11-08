import type { z } from 'zod'

import type { networkSchemaCreate } from '../schema/network-schema-create.ts'

export type NetworkInputCreate = z.infer<typeof networkSchemaCreate>
