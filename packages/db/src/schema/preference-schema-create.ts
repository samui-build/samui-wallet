import { preferenceSchema } from './preference-schema'

export const preferenceSchemaCreate = preferenceSchema.omit({ createdAt: true, id: true, updatedAt: true })
