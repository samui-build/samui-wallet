import { accountSchema } from './account-schema'

export const accountSchemaUpdate = accountSchema.omit({ createdAt: true, id: true, updatedAt: true }).partial()
