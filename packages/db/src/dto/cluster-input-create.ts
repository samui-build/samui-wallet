import type { z } from 'zod'

import type { clusterSchemaCreate } from '../schema/cluster-schema-create.js'

export type ClusterInputCreate = z.infer<typeof clusterSchemaCreate>
