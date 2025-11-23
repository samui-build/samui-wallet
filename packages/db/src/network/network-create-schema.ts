import { networkSchema } from './network-schema.ts'

export const networkCreateSchema = networkSchema.omit({ createdAt: true, id: true, updatedAt: true })
