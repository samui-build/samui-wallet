import { clusterSchema } from './cluster-schema'

export const clusterSchemaCreate = clusterSchema.omit({ createdAt: true, id: true, updatedAt: true })
