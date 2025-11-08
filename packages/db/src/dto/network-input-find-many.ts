import type { z } from 'zod'

import type { networkSchemaFindMany } from '../schema/network-schema-find-many.ts'

export type NetworkInputFindMany = z.infer<typeof networkSchemaFindMany>
