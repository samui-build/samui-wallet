import { clusterSchema } from './cluster-schema.js'

export const clusterSchemaUpdate = clusterSchema
  .omit({ createdAt: true, id: true, type: true, updatedAt: true })
  .partial()
