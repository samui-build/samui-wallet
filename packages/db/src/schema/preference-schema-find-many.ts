import { preferenceSchema } from './preference-schema.js'

export const preferenceSchemaFindMany = preferenceSchema.pick({ id: true, key: true, value: true }).partial()
