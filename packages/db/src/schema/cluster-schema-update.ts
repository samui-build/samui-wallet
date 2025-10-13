import { clusterSchema } from './cluster-schema'

export const clusterSchemaUpdate = clusterSchema.omit({ createdAt: true, id: true, updatedAt: true }).partial()
