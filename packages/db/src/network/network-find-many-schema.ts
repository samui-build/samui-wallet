import { z } from 'zod'

import { networkSchema } from './network-schema.ts'

export const networkFindManySchema = networkSchema
  .pick({ endpoint: true, id: true, name: true, type: true })
  .extend({ endpoint: z.string() })
  .partial()
