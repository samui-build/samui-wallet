import type { z } from 'zod'

import type { clusterSchemaUpdate } from '../schema/cluster-schema-update'

export type ClusterInputUpdate = z.infer<typeof clusterSchemaUpdate>
