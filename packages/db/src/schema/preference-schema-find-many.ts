import { preferenceSchema } from './preference-schema.ts'

export const preferenceSchemaFindMany = preferenceSchema.pick({ id: true, key: true, value: true }).partial()
