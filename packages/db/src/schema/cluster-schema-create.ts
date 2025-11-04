import { clusterSchema } from './cluster-schema.ts'

export const clusterSchemaCreate = clusterSchema.omit({ createdAt: true, id: true, updatedAt: true })
