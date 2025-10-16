import { preferenceSchema } from './preference-schema'

export const preferenceSchemaFindMany = preferenceSchema.pick({ id: true, key: true, value: true }).partial()
