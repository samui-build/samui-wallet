import type { z } from 'zod'

import type { clusterSchema } from '../schema/cluster-schema'

export type Cluster = z.infer<typeof clusterSchema>
