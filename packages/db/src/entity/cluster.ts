import type { z } from 'zod'

import type { clusterSchema } from '../schema/cluster-schema.js'

export type Cluster = z.infer<typeof clusterSchema>
