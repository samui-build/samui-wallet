import { clusterSchema } from './cluster-schema'

export const clusterSchemaUpdate = clusterSchema
  .omit({ createdAt: true, id: true, type: true, updatedAt: true })
  .partial()
