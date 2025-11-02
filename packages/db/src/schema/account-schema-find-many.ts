import { accountSchema } from './account-schema.js'

export const accountSchemaFindMany = accountSchema.pick({ id: true, name: true }).partial()
