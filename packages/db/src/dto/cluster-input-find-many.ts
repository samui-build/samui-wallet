import type { z } from 'zod'

import type { clusterSchemaFindMany } from '../schema/cluster-schema-find-many'

export type ClusterInputFindMany = z.infer<typeof clusterSchemaFindMany>
