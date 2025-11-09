import { networkSchema } from './network-schema.ts'

export const networkSchemaCreate = networkSchema.omit({ createdAt: true, id: true, updatedAt: true })
