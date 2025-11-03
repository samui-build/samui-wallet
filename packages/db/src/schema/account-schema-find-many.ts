import { accountSchema } from './account-schema.ts'

export const accountSchemaFindMany = accountSchema.pick({ id: true, name: true }).partial()
