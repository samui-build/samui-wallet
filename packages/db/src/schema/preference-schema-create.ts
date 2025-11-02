import { preferenceSchema } from './preference-schema.js'

export const preferenceSchemaCreate = preferenceSchema.omit({ createdAt: true, id: true, updatedAt: true })
