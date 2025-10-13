import type { z } from 'zod'

import type { clusterTypeSchema } from '../schema/cluster-type-schema'

export type ClusterType = z.infer<typeof clusterTypeSchema>
