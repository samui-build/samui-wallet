import { preferenceSchema } from './preference-schema'

export const preferenceSchemaUpdate = preferenceSchema
  .omit({ createdAt: true, id: true, key: true, updatedAt: true })
  .partial()
