import { networkSchema } from './network-schema.ts'

export const networkSchemaUpdate = networkSchema
  .omit({ createdAt: true, id: true, type: true, updatedAt: true })
  .partial()
