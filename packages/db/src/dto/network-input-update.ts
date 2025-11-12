import type { z } from 'zod'

import type { networkSchemaUpdate } from '../schema/network-schema-update.ts'

export type NetworkInputUpdate = z.infer<typeof networkSchemaUpdate>
