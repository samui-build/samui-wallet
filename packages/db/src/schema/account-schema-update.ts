import { accountSchema } from './account-schema.ts'

export const accountSchemaUpdate = accountSchema.omit({ createdAt: true, id: true, updatedAt: true }).partial()
