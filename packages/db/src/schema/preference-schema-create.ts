import { preferenceSchema } from './preference-schema.ts'

export const preferenceSchemaCreate = preferenceSchema.omit({ createdAt: true, id: true, updatedAt: true })
