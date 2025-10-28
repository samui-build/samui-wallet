import { z } from 'zod'

import { clusterTypeSchema } from './cluster-type-schema'

export const clusterSchema = z.object({
  createdAt: z.date(),
  endpoint: z.url(),
  endpointSubscriptions: z.url().optional(),
  id: z.string(),
  name: z.string(),
  type: clusterTypeSchema,
  updatedAt: z.date(),
})
