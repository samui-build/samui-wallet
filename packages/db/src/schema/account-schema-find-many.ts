import { accountSchema } from './account-schema'

export const accountSchemaFindMany = accountSchema.pick({ id: true, name: true }).partial()
