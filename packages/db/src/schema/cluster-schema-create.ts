import { clusterSchema } from './cluster-schema.js'

export const clusterSchemaCreate = clusterSchema.omit({ createdAt: true, id: true, updatedAt: true })
