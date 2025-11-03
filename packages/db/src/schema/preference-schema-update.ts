import { preferenceSchema } from './preference-schema.ts'

export const preferenceSchemaUpdate = preferenceSchema
  .omit({ createdAt: true, id: true, key: true, updatedAt: true })
  .partial()
