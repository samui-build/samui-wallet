import { clusterSchema } from './cluster-schema.ts'

export const clusterSchemaUpdate = clusterSchema
  .omit({ createdAt: true, id: true, type: true, updatedAt: true })
  .partial()
