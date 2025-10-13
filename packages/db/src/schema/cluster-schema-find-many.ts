import { z } from 'zod'

import { clusterSchema } from './cluster-schema'

export const clusterSchemaFindMany = clusterSchema
  .pick({ endpoint: true, id: true, name: true, type: true })
  .extend({ endpoint: z.string() })
  .partial()
